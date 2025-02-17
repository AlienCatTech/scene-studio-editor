<script lang="ts">
	import { onMount, type SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { preset } from '$lib/store';
	import {
		addToDict,
		changeItemInDict,
		numToString,
		parseTimeString,
		validTime
	} from '$lib/common';
	import Alarm from './Alarm.svelte';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	// Form Data
	const formData = {
		hour: 0,
		min: 0,
		sec: 0
	};
	let visible = false;
	let errMsg = '';
	let meta = '';
	onMount(() => {
		if (!$modalStore) {
			return;
		}
		const cur = $modalStore[0];
		if (cur && cur.meta) {
			const [h, m, s] = parseTimeString(cur.meta);
			formData.hour = h;
			formData.min = m;
			formData.sec = s;
			meta = cur.meta;
		}
	});

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		// Input validation
		if (!validTime(formData.hour, formData.min, formData.sec)) {
			errMsg = 'Input not valid';
			visible = true;
			return;
		}
		const timeStr = numToString(formData.hour, formData.min, formData.sec);
		if (timeStr in $preset) {
			errMsg = 'Time already exist';
			visible = true;
			return;
		}

		preset.update((p) => {
			if (meta) {
				return changeItemInDict(meta, timeStr, p);
			}
			return addToDict(timeStr, p);
		});
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{meta ? 'Change Time' : 'Add A Time'}</header>
		<article>Add a time in order to schedule events.</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<label class="label">
				<span>At Time...</span>
				<div class="flex gap-4">
					<input
						class="input"
						type="number"
						bind:value={formData.hour}
						placeholder="Hour"
						max="99"
						min="0"
					/>
					<input
						class="input"
						type="number"
						bind:value={formData.min}
						placeholder="Minute"
						max="59"
						min="0"
					/>
					<input
						class="input"
						type="number"
						bind:value={formData.sec}
						placeholder="Second"
						max="59"
						min="0"
					/>
				</div>
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
