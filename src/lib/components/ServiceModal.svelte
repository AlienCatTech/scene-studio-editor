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
	import { changeItemInArray, convertToOutputObject } from '$lib/common';
	import type { ServiceSlot } from '$lib/types';
	const modalStore = getModalStore();

	type MetaProp = {
		i?: number;
		time: string;
		serviceSlot?: ServiceSlot;
	};

	type HAService = {
		domain: string;
		services: {
			[x: string]: {
				fields: {
					[x: string]: {
						example: string;
						required: boolean;
					};
				};
			};
		};
	};

	let visible = false;
	let errMsg = '';
	let meta: MetaProp = { time: '' };

	let serviceData: HAService[] = [];
	let dataPlaceholder = '';
	let dataRequiredFields: string[] = [];

	let serviceInput = '';
	let dataInput = '';
	let entityInput = '';

	let services: AutocompleteOption<string>[] = [];
	let entities: AutocompleteOption<string>[] = [];

	onMount(async () => {
		if ($modalStore && $modalStore[0] && $modalStore[0].meta) {
			meta = $modalStore[0].meta;
			if (meta.serviceSlot) {
				serviceInput = meta.serviceSlot.service;
				dataInput = meta.serviceSlot.data ? JSON.stringify(meta.serviceSlot.data, null, 2) : '';
				entityInput = meta.serviceSlot.target?.entity_id || '';
				setupEntityFilter();
			}
		}

		if ($loginStore) {
			serviceData = await listServices();
			services = serviceData
				.map((domain: { services: object; domain: string }) => {
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
		event: 'focus-click',
		target: 'serviceAutocomplete',
		placement: 'bottom'
	};
	let entityPopupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'entityAutocomplete',
		placement: 'bottom'
	};
	const setupEntityFilter = () => {
		const parts = serviceInput.split('.');
		const domain = serviceData.find((x) => x.domain == parts[0]);
		if (domain) {
			const fields = domain.services[parts[1]]['fields'];
			const keys = Object.keys(domain.services[parts[1]]['fields']);
			dataPlaceholder = JSON.stringify(
				convertToOutputObject(
					keys.map((field) => ({
						[field]: fields[field]['example']
					}))
				),
				null,
				2
			);
			dataRequiredFields = keys
				.map((field) => {
					if (fields[field].required) return field;
				})
				.filter((x) => x !== undefined);
		}
	};
	const onServiceSelect = (x: { detail: { value: string } }) => {
		serviceInput = x.detail.value;
		setupEntityFilter();
	};
	const onEntitySelect = (x: { detail: { value: string } }) => {
		entityInput = x.detail.value;
	};
	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		// Input validation
		if (!serviceInput) {
			errMsg = 'Invalid Input: no service';
			visible = true;
			return;
		}
		if (!serviceInput.includes('.')) {
			errMsg = 'Invalid Input: invalid service';
			visible = true;
			return;
		}
		try {
			if (dataInput) {
				const j = JSON.parse(dataInput);
				dataRequiredFields.forEach((f) => {
					if (!(f in j)) {
						errMsg = `Invalid Input: ${f} is required`;
						visible = true;
						return;
					}
				});
			}
		} catch (e) {
			errMsg = 'Invalid Input: ' + e;
			visible = true;
			return;
		}

		const body = {
			service: serviceInput,
			data: dataInput ? JSON.parse(dataInput) : dataInput,
			target: {
				entity_id: entityInput
			}
		};
		if (meta.i != undefined) {
			preset.update((p) => {
				p[meta.time] = changeItemInArray(p[meta.time], meta.i!, body);
				console.log(2, p);
				return p;
			});
			modalStore.close();
			return;
		}

		preset.update((p) => {
			p[meta.time] = [...p[meta.time], body];
			return p;
		});
		modalStore.close();
	}
	function entityFilter(): AutocompleteOption<string>[] {
		// Create a local copy of options
		let _options = [...entities];
		// Filter options
		return _options.filter((x) => x.value.startsWith(serviceInput.split('.')[0]));
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
			{meta.i ? 'Change Service' : 'Add A Service'}
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
				{#if dataPlaceholder}
					<div class="  text-gray-500 text-sm">
						<button class="underline" on:click={() => (dataInput = dataPlaceholder)}
							>Use Example</button
						>
						{#if dataRequiredFields.length > 0}
							<span>Required fields: {dataRequiredFields.join(', ')}</span>
						{/if}
					</div>
				{/if}
				<textarea class="textarea" bind:value={dataInput} placeholder={dataPlaceholder} rows="5" />
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
