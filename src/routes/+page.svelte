<script lang="ts">
	import { getFullFileName, getOnlyFileName } from '$lib/common';
	import TimeTable from '$lib/components/TimeTable.svelte';
	import examplePreset from '$lib/examplePreset';
	import { getMedia, uploadMedia } from '$lib/ha';
	import { fileName, loginStore, preset } from '$lib/store';

	import { getModalStore, getToastStore, FileButton } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const loginModal: ModalSettings = {
		type: 'component',
		component: 'loginModal'
	};

	const handleLogin = () => {
		modalStore.trigger(loginModal);
	};

	let fileInput: FileList;

	const toastMsg = (message: string, isErr: boolean = false) => {
		const t: ToastSettings = isErr
			? {
					message,
					background: 'variant-filled-error'
				}
			: {
					message
				};

		toastStore.trigger(t);
	};

	const handleLoad = async () => {
		try {
			const media = await getMedia(getFullFileName($fileName));
			preset.set(media);
		} catch (e) {
			toastMsg('Failed to load: ' + e, true);
		}
	};

	const handleSave = async () => {
		try {
			if (!$fileName) {
				toastMsg('Give file a name!');
				return;
			}

			const blob = new Blob([JSON.stringify($preset)], { type: 'application/json' });
			const file = new File([blob], getFullFileName($fileName), { type: 'application/json' });

			await uploadMedia(file);
			toastMsg('Successfully saved to your media! Remember to select it in home assistant');
		} catch (e) {
			toastMsg('Failed to save: ' + e, true);
		}
	};

	const handleImport = async () => {
		const file = fileInput.item(0);
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				if (e.target && e.target.result) {
					preset.set(JSON.parse(e.target.result as string));
					const name = getOnlyFileName(file.name);
					fileName.set(name);
				}
			} catch (e) {
				toastMsg('Failed to import: ' + e, true);
			}
		};

		reader.readAsText(file);
	};

	const handleExport = async () => {
		if (!$fileName) {
			toastMsg('Give file a name!');
			return;
		}
		const blob = new Blob([JSON.stringify($preset)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = getFullFileName($fileName);

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	onMount(() => {
		if (localStorage.getItem('preset')) preset.set(JSON.parse(localStorage.getItem('preset')!));
		if (localStorage.getItem('fileName')) fileName.set(localStorage.getItem('fileName')!);
		preset.subscribe((x) => localStorage.setItem('preset', JSON.stringify(x)));
		fileName.subscribe((x) => localStorage.setItem('fileName', x));
	});
</script>

<div class="flex flex-col gap-4 mt-4 container container h-full mx-auto">
	<div class="md:flex justify-between items-center">
		<div class="w-fit">
			<label class="flex">
				<span class=" flex items-center w-full">File Name</span>
				<input class="input" type="text" bind:value={$fileName} placeholder="myScene" />
			</label>
		</div>
		<div class="md:flex gap-2">
			{#if $loginStore}
				<button type="button" class="btn variant-filled-success w-fit" on:click={handleLogin}>
					Connected
				</button>
				<button type="button" class="btn variant-ghost-secondary w-fit" on:click={handleLoad}>
					Load
				</button>
				<button type="button" class="btn variant-ghost-secondary w-fit" on:click={handleSave}>
					Save
				</button>
			{:else}
				<button type="button" class="btn variant-filled-primary w-fit" on:click={handleLogin}>
					Login to HuffOS
				</button>
			{/if}
		</div>
	</div>
	<div class="md:flex justify-end gap-2">
		<button
			type="button"
			class="btn variant-filled w-fit"
			on:click={() => preset.set(examplePreset)}
		>
			Load Example
		</button>
		<button type="button" class="btn variant-filled-warning w-fit" on:click={() => preset.set({})}>
			Clear
		</button>
		<FileButton
			name="files"
			accept="application/json"
			button="btn variant-filled-secondary"
			bind:files={fileInput}
			on:change={handleImport}
		/>
		<button type="button" class="btn variant-filled-secondary w-fit" on:click={handleExport}>
			Download
		</button>
	</div>
	<div class="flex justify-center">
		<TimeTable />
	</div>
</div>
