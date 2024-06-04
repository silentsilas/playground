<script lang="ts">
	import type { SearchResult } from '$lib/utils/search';
	import { searchResults } from '$lib/store';

	let results: SearchResult[] = [];

	searchResults.subscribe((value: SearchResult[]) => {
		results = value ? value : [];
	});

	const selfhostedServices = [
		{
			title: 'Nextcloud',
			url: 'https://box.silentsilas.com',
			description:
				"A file hosting service that I use as an alternative to Dropbox and Google/Apple photos. It's a bit slow as it's running on a cheap DigitalOcean VPS, but I can provision an account with 10GB of storage for you if you'd like."
		},
		{
			title: 'PrivateBin',
			url: 'https://bin.silentsilas.com',
			description:
				"A pastebin service, useful for sending quick text snippets or sharing sensitive data with Burn After Reading. It doesn't require an account, but I do log the IP addresses of visitors for security purposes. None of the data entered is stored on the server thanks to E2E encryption."
		},
		{
			title: 'FreshRSS',
			url: 'https://rss.silentsilas.com',
			description:
				"A self-hosted RSS reader that I use to keep up with blogs, podcasts, and news sites. I can provision an account for you if you want to try it out. You would use an RSS client on your devices and have them subscribe to your FreshRSS URL. You would then add all of the RSS feeds you'd like to follow via the FreshRSS web interface and all of your RSS clients will then pull the articles for you to read."
		},
		{
			title: 'The Lounge',
			url: 'https://irc.silentsilas.com',
			description:
				"An IRC client that I use to connect to the Libera network and chat with other developers. Holler if you'd like an account provisioned for you. Logs are kept for preserving chat history, but I do not check the logs unless I have reason to believe that the service is being abused (or local authorities ask me to)."
		},
		{
			title: 'Gitea',
			url: 'https://git.silentsilas.com',
			description:
				"A self-hosted Git service that I use to host my personal projects. I can provision an account for you if you'd like to host your own projects."
		},
		{
			title: 'Jellyfin',
			url: 'https://jellyfin.silentsilas.com',
			description:
				'A self-hosted media server that I use to stream movies, shows, and music to my devices. It may or may not be available, as its dependent on the availability of my home PC.'
		}
	];
</script>

{#if results.length <= 0}
	<div class="container mx-auto flex flex-col items-center">
		<div class="prose">
			<h1 class="py-6 pt-10">Services</h1>
			<p>
				I self-host a lot of services I find useful, and to rely less on third-party cloud services.
				None of them run any analytics or log your activity, but the software/servers may be
				outdated, so use at your own risk.
			</p>

			<ul>
				{#each selfhostedServices as service}
					<li>
						<h3>
							<a class="link" href={service.url} target="_blank">
								{service.title}
							</a>
						</h3>
						<p class="text-sm">{service.description}</p>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
