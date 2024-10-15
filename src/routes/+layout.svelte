<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, autoModeWatcher, LightSwitch } from '@skeletonlabs/skeleton';

	import { initializeStores, Modal, Toast, getToastStore } from '@skeletonlabs/skeleton';
	import type { ModalComponent, ToastSettings } from '@skeletonlabs/skeleton';
	import LoginModal from '$lib/components/LoginModal.svelte';
	import TimeModal from '$lib/components/TimeModal.svelte';
	import ServiceModal from '$lib/components/ServiceModal.svelte';
	import { onMount } from 'svelte';
	import { loginStore } from '$lib/store';
	import { testConnection } from '$lib/ha';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	initializeStores();
	const toastStore = getToastStore();
	const modalRegistry: Record<string, ModalComponent> = {
		loginModal: { ref: LoginModal },
		timeModal: { ref: TimeModal },
		serviceModal: { ref: ServiceModal }
	};

	onMount(async () => {
		const loginStr = localStorage.getItem('login');
		if (loginStr) {
			const login = JSON.parse(loginStr);
			const err = await testConnection(login);
			if (!err) {
				loginStore.set(login);
			} else {
				const t: ToastSettings = {
					message: 'Failed to connect: ' + err,
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
			}
		}
	});
</script>

<Modal components={modalRegistry} />
<Toast position="tr" />
<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Scene Studio Editor</strong>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<LightSwitch />
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://huffbox.aliencat.dev"
					target="_blank"
					rel="noreferrer"
				>
					HuffBox
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/AlienCatTech/scene-studio-editor"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
