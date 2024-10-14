<script lang="ts">
	import { onMount, type SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { loginStore, preset } from '$lib/store';
	import { listEntities, listServices } from '$lib/ha';
	import { Autocomplete } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption, PopupSettings } from '@skeletonlabs/skeleton';
	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;
	import { popup } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	// Form Data
	const formData = {
		service: '',
		data: {},
		target: { entity_id: '' }
	};
	let visible = false;
	let errMsg = '';
	let meta: {
		service?: string;
		time?: string;
	} = {};

	let serviceInput = '';
	let dataInput = '';
	let entityInput = '';

	let services: AutocompleteOption<string>[] = [];
	let entities: AutocompleteOption<string>[] = [];

	onMount(async () => {
		if ($modalStore && $modalStore[0] && $modalStore[0].meta) {
			meta = $modalStore[0].meta;
			if (meta.service) {
				serviceInput = meta.service;
				dataInput = JSON.stringify($preset[meta.time!][serviceInput].data);
				entityInput = $preset[meta.time!][serviceInput].target?.entity_id || '';
			}
		}

		if ($loginStore) {
			const serviceRes = await listServices();
			services = serviceRes
				.map((domain: { services: {}; domain: any }) => {
					return Object.keys(domain.services).map((s) => {
						return { value: `${domain.domain}.${s}`, label: `${domain.domain}.${s}` };
					});
				})
				.flat();
			const entityRes = await listEntities();
			entities = entityRes.map((e: { entity_id: string }) => ({
				value: e.entity_id,
				label: e.entity_id
			}));
		}
	});
	let servicePopupSettings: PopupSettings = {
		event: 'click',
		target: 'serviceAutocomplete',
		placement: 'bottom'
	};
	let entityPopupSettings: PopupSettings = {
		event: 'click',
		target: 'entityAutocomplete',
		placement: 'bottom'
	};
	const onServiceSelect = (x: { detail: { value: string } }) => {
		serviceInput = x.detail.value;
		formData.service = x.detail.value;
	};
	const onEntitySelect = (x: { detail: { value: string } }) => {
		entityInput = x.detail.value;
		formData.target.entity_id = x.detail.value;
	};
	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		// Input validation
		if (!formData.service) {
			errMsg = 'Invalid Input';
			visible = true;
			return;
		}
		try {
			if (dataInput) {
				JSON.parse(dataInput);
			}
		} catch (e) {
			errMsg = 'Invalid Input' + e;
			visible = true;
			return;
		}

		if (!meta.service && formData.service in $preset[meta.time!]) {
			errMsg = 'Service already exist';
			visible = true;
			return;
		}

		preset.update((p) => {
			p[meta.time!] = {
				...p[meta.time!],
				...{
					[formData.service]: {
						data: dataInput ? JSON.parse(dataInput) : undefined,
						target: formData.target
					}
				}
			};
			return p;
		});
		modalStore.close();
	}
	function entityFilter(): AutocompleteOption<string>[] {
		// Create a local copy of options
		let _options = [...entities];
		// Filter options
		return _options.filter((x) => x.value.startsWith(formData.service.split('.')[0]));
	}
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			{meta.service ? 'Change Service' : 'Add A Service'}
		</header>
		<article>Add a service to a scene.</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Service</span>
				<input
					class="input autocomplete"
					type="search"
					name="autocomplete-search-service"
					bind:value={serviceInput}
					placeholder="Search..."
					use:popup={servicePopupSettings}
				/>
				<div
					data-popup="serviceAutocomplete"
					class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto"
					tabindex="-1"
				>
					<Autocomplete
						bind:input={serviceInput}
						options={services}
						on:selection={onServiceSelect}
					/>
				</div>
			</label>
			<label class="label">
				<span>Data</span>
				<input
					class="input"
					type="text"
					bind:value={dataInput}
					placeholder={JSON.stringify({ value: 123 })}
				/>
				<span class="text-gray-400"
					>You can also use <a
						class="underline"
						href="https://www.home-assistant.io/docs/configuration/templating/">template</a
					>
					here. Example: {JSON.stringify({ value: "{{states('sensor.sun_next_noon')}}" })}</span
				>
			</label>
			<label class="label">
				<span>Target Entity</span>
				<input
					class="input autocomplete"
					type="search"
					name="autocomplete-search-entity"
					bind:value={entityInput}
					placeholder="Search..."
					use:popup={entityPopupSettings}
				/>
				<div
					data-popup="entityAutocomplete"
					class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto"
					tabindex="-1"
				>
					<Autocomplete
						bind:input={entityInput}
						options={entities}
						on:selection={onEntitySelect}
						filter={entityFilter}
					/>
				</div>
			</label>
		</form>
		{#if visible}
			<aside class="alert variant-filled-error">
				<!-- Message -->
				<div class="alert-message">
					<p>{errMsg}</p>
				</div>
			</aside>
		{/if}
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>{parent.buttonTextSubmit}</button>
		</footer>
	</div>
{/if}
