import { loadPage, type Page } from "./Page.ts";


export const privacyPage: Page = {
  url: "/privacy",
  title: "privacy",
  navbar: false,

  getPage(): string {
    return /*html*/`
  <div class="h-full flex flex-col items-center justify-center p-8 text-left max-w-2xl mx-auto space-y-4">
    <h1 class="text-3xl font-bold text-white">Vos droits concernant vos données personnelles</h1>
    <p>
      Conformément au <strong>Règlement général sur la protection des données (RGPD)</strong>, vous disposez des droits suivants :
    </p>
    <ul class="list-disc list-inside space-y-2">
      <li><strong>Droit d’accès</strong> : demander l’accès aux données personnelles que nous détenons à votre sujet.</li>
      <li><strong>Droit de rectification</strong> : demander la correction de vos données si elles sont inexactes ou incomplètes.</li>
      <li><strong>Droit à l’effacement</strong> (ou droit à l’oubli) : demander la suppression de vos données personnelles dans certaines conditions.</li>
      <li><strong>Droit à l’anonymisation</strong> : demander que vos données soient rendues anonymes de manière irréversible.</li>
    </ul>
    <p>Pour exercer l’un de ces droits, contactez-nous via ft_transcendence@gmail.com</p>
    <a href="https://ec.europa.eu/info/law/law-topic/data-protection_en" target="_blank" class="text-blue-400 hover:underline">
      👉 En savoir plus sur vos droits
    </a>
  </div>
`;
  },

  onMount() {
  },

  onUnmount() {
  }
};
