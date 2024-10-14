<script lang="ts">
	import { setLogin } from '$lib/common';
	import { loginStore } from '$lib/store';
	import { onMount, type SvelteComponent } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { testConnection } from '$lib/ha';
	import Alarm from './Alarm.svelte';
	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	// Form Data
	let formData = {
		url: '',
		token: ''
	};
	let visible = false;
	let errMsg = '';
	// We've created a custom submit function to pass the response and close the modal.
	async function onFormSubmit() {
		if (!formData.token || !formData.url) {
			return;
		}

		formData.url = formData.url.endsWith('/')
			? formData.url.substring(0, formData.url.length - 1)
			: formData.url;

		const err = await testConnection(formData);
		if (err) {
			errMsg = 'Connection failed: ' + err;
			visible = true;
			return;
		}
		setLogin(formData);
		modalStore.close();
	}

	onMount(() => {
		if ($loginStore) {
			formData = $loginStore;
		}
	});

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>Log in to HuffOS/Home Assistant</header>
		<article>
			While you can use this editor offline, connecting to a server can autocomplete your resources.
			Your token will be saved in the browser.
		</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<label class="label">
				<span>URL</span>
				<input
					class="input"
					type="text"
					bind:value={formData.url}
					placeholder="http://localhost:8123"
				/>
			</label>
			<label class="label">
				<span>Long-lived access tokens (you can get it under your profile > security)</span>
				<input class="input" type="tel" bind:value={formData.token} placeholder="eyJhb..." />
			</label>
		</form>
		<Alarm {visible} {errMsg}></Alarm>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>{parent.buttonTextSubmit}</button>
		</footer>
	</div>
{/if}
