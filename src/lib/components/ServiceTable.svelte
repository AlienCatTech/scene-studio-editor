<script lang="ts">
	import { removeItemFromArray } from '$lib/common';
	import { preset } from '$lib/store';
	import type { ServiceSlot } from '$lib/types';
	import TargetTable from './TargetTable.svelte';
	import Icon from '@iconify/svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	export let services: ServiceSlot[];
	export let time: string;

	const handleEdit = (time: string, i: number, serviceSlot: ServiceSlot) => {
		const serviceModal: ModalSettings = {
			type: 'component',
			component: 'serviceModal',
			meta: { time, i, serviceSlot }
		};
		modalStore.trigger(serviceModal);
	};

	function handleRemove(time: string, i: number) {
		preset.update((p) => {
			p[time] = removeItemFromArray(p[time], i);
			return p;
		});
	}
</script>

<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover dark:hover:bg-gray-700 hover:bg-gray-300">
		<tbody>
			{#each services as s, i}
				<tr>
					<td class="border-r border-gray-600 pr-4 table-cell-fit">{s.service}</td>
					<td>
						{s.data ? JSON.stringify(s.data, null, 2) : ''}
					</td>
					<td class="table-cell-fit">
						<TargetTable targets={s.target}></TargetTable>
					</td>
					<td class="table-cell-fit">
						<div class="flex flex-row gap-2 justify-end">
							<button
								type="button"
								class="btn-icon variant-filled-tertiary"
								on:click={() => handleEdit(time, i, s)}
								><Icon icon="ic:baseline-edit"></Icon></button
							>

							<button
								type="button"
								class="btn-icon variant-filled-error"
								on:click={() => handleRemove(time, i)}
								><Icon icon="ic:baseline-delete"></Icon></button
							>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
