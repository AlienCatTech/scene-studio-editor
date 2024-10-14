<script lang="ts">
	import TimeTable from '$lib/components/TimeTable.svelte';
	import { loginStore, preset } from '$lib/store';

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();

	const loginModal: ModalSettings = {
		type: 'component',
		component: 'loginModal'
	};

	const handleLogin = () => {
		modalStore.trigger(loginModal);
	};

	onMount(() => {
		preset.set({
			'00:00:00': {
				'text.set': {
					data: {
						value:
							'asdasddq3d qeq223 23jh 234jhb 234bjh 234bjh23jhb423jh4234jh jh 34jh 234jh basdasddq3d qeq223 23jh 234jhb 234bjh 234bjh23jhb423jh4234jh jh 34jh 234jh basdasddq3d qeq223 23jh 234jhb 234bjh 234bjh23jhb423jh4234jh jh 34jh 234jh basdasddq3d qeq223 23jh 234jhb 234bjh 234bjh23jhb423jh4234jh jh 34jh 234jh b'
					},
					target: {
						entity_id: 'test'
					}
				},
				'time.set': {
					data: {
						value: 123
					}
				}
			},
			'00:00:01': {
				'text.set': {
					data: {
						value: 123
					},
					target: {
						entity_id: 'test',

						device_id: 'test'
					}
				}
			}
		});
	});
</script>

<div class="flex flex-col gap-4 mt-4 container container h-full mx-auto">
	<div class="flex justify-end">
		{#if $loginStore}
			<button type="button" class="btn variant-filled-success w-fit" on:click={handleLogin}
				>Logged in to HuffOS</button
			>
		{:else}
			<button type="button" class="btn variant-filled w-fit" on:click={handleLogin}
				>Login to HuffOS</button
			>
		{/if}
	</div>
	<div class="flex justify-center">
		<TimeTable />
	</div>
</div>
