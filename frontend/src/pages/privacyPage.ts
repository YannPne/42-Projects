import { type Page } from "./Page.ts";


export const privacyPage: Page = {
  url: "/privacy",
  title: "Privacy Policy",

  getPage() {
    return /*html*/`
      <div class="h-full flex flex-col items-center justify-center p-8 text-left max-w-2xl mx-auto space-y-4">
        <h1 class="text-3xl font-bold text-white">Your Rights Regarding Personal Data</h1>
        <p>
          In accordance with the <strong>General Data Protection Regulation (GDPR)</strong>, you have the following rights:
        </p>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Right of Access</strong>: request access to the personal data we hold about you.</li>
          <li><strong>Right to Rectification</strong>: request correction of your data if it is inaccurate or incomplete.</li>
          <li><strong>Right to Erasure</strong> (or right to be forgotten): request the deletion of your personal data under certain conditions.</li>
          <li><strong>Right to Anonymization</strong>: request that your data be irreversibly anonymized.</li>
        </ul>
        <p>To exercise any of these rights, contact us at ft_transcendence@gmail.com</p>
        <a href="https://ec.europa.eu/info/law/law-topic/data-protection_en" target="_blank" class="text-blue-400 hover:underline">
        &#x1f449; Learn more about your rights
        </a>
      </div>  
  `;
  },

  onMount() {
  },

  onUnmount() {
  }
};
