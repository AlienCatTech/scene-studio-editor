<script lang="ts">
	import { removeItemFromDict } from '$lib/common';
	import { preset } from '$lib/store';
	import type { TimePattern } from '$lib/types';
	import TargetTable from './TargetTable.svelte';
	import Icon from '@iconify/svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	export let services: TimePattern;
	export let time: string;

	const handleEdit = (time: string, s: string) => {
		const serviceModal: ModalSettings = {
			type: 'component',
			component: 'serviceModal',
			meta: { time, service: s }
		};
		modalStore.trigger(serviceModal);
	};

	function handleRemove(time: string, s: string) {
		preset.update((p) => {
			p[time] = removeItemFromDict(s, p[time]);
			return p;
		});
	}
</script>

<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover hover:bg-gray-700">
		<tbody>
			{#each Object.keys(services) as s, i}
				<tr>
					<td class="border-r border-gray-600 pr-4 table-cell-fit">{s}</td>
					<td>
						{services[s].data ? JSON.stringify(services[s].data, null, 2) : ''}
					</td>
					<td class="table-cell-fit">
						<TargetTable targets={services[s].target}></TargetTable>
					</td>
					<td class="table-cell-fit">
						<div class="flex flex-row gap-2 justify-end">
							<button
								type="button"
								class="btn-icon variant-filled-tertiary"
								on:click={() => handleEdit(time, s)}><Icon icon="ic:baseline-edit"></Icon></button
							>

							<button
								type="button"
								class="btn-icon variant-filled-error"
								on:click={() => handleRemove(time, s)}
								><Icon icon="ic:baseline-delete"></Icon></button
							>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
