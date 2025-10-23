<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'PrivacyPolicy',
    data() {
      return {
        lastUpdated: '2024-01-01'
      }
    }
  })
</script>

<style lang="scss">
  .privacy-policy {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);

    .section {
      margin-bottom: var(--spacing);
    }

    .contact-info {
      background-color: var(--color-quaternary);
      padding: var(--spacing);
      border-radius: var(--border-radius);
      border-left: 4px solid var(--color-primary);
    }
  }
</style>

<template>
  <div class="section privacy-policy">
    <h1>Privacy Policy</h1>

    <p><strong>Last updated:</strong> {{ lastUpdated }}</p>

    <div class="section">
      <h2>Introduction</h2>
      <p>
        This Privacy Policy describes how GimmeHTTP ("we", "our", or "us") collects, uses, and shares information when
        you visit our website at gimmehttp.com (the "Site").
      </p>
    </div>

    <div class="section">
      <h2>Information We Collect</h2>

      <h3>Information You Provide</h3>
      <p>We may collect information that you voluntarily provide to us, such as:</p>
      <ul>
        <li>Contact information when you reach out to us</li>
        <li>Feedback and comments you submit</li>
        <li>Information you provide when using our interactive tools</li>
      </ul>

      <h3>Information Automatically Collected</h3>
      <p>When you visit our Site, we may automatically collect certain information, including:</p>
      <ul>
        <li>Log data (IP address, browser type, pages visited, time spent)</li>
        <li>Device information (device type, operating system)</li>
        <li>Usage data (how you interact with our Site)</li>
      </ul>
    </div>

    <div class="section">
      <h2>Cookies and Tracking Technologies</h2>

      <h3>Google AdSense</h3>
      <p>
        Our Site uses Google AdSense to display advertisements. Google AdSense uses cookies and similar technologies to
        serve ads based on your visits to our Site and other sites on the Internet. You may opt out of personalized
        advertising by visiting
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google's Ad Settings</a>.
      </p>

      <p>
        For more information about how Google uses data when you use our Site, please visit
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google's Privacy Policy</a>.
      </p>

      <h3>Analytics</h3>
      <p>
        We may use analytics services to understand how our Site is used. These services may use cookies and similar
        technologies to collect information about your use of our Site.
      </p>
    </div>

    <div class="section">
      <h2>How We Use Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and maintain our Site</li>
        <li>Improve our services and user experience</li>
        <li>Respond to your inquiries and provide support</li>
        <li>Display relevant advertisements</li>
        <li>Analyze usage patterns and trends</li>
        <li>Comply with legal obligations</li>
      </ul>
    </div>

    <div class="section">
      <h2>Information Sharing</h2>
      <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
      <ul>
        <li>With your consent</li>
        <li>To comply with legal obligations</li>
        <li>To protect our rights and safety</li>
        <li>With service providers who assist us in operating our Site (under strict confidentiality agreements)</li>
      </ul>
    </div>

    <div class="section">
      <h2>Data Security</h2>
      <p>
        We implement appropriate security measures to protect your personal information. However, no method of
        transmission over the Internet or electronic storage is 100% secure.
      </p>
    </div>

    <div class="section">
      <h2>Your Rights</h2>
      <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
      <ul>
        <li>The right to access your personal information</li>
        <li>The right to correct inaccurate information</li>
        <li>The right to delete your personal information</li>
        <li>The right to restrict or object to processing</li>
        <li>The right to data portability</li>
      </ul>
    </div>

    <div class="section">
      <h2>Third-Party Links</h2>
      <p>
        Our Site may contain links to third-party websites. We are not responsible for the privacy practices of these
        external sites. We encourage you to review their privacy policies.
      </p>
    </div>

    <div class="section">
      <h2>Children's Privacy</h2>
      <p>
        Our Site is not intended for children under 13 years of age. We do not knowingly collect personal information
        from children under 13.
      </p>
    </div>

    <div class="section">
      <h2>Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
        Privacy Policy on this page and updating the "Last updated" date.
      </p>
    </div>

    <div class="contact-info">
      <h2>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at:</p>
      <p>
        <strong>Email:</strong> <a href="mailto:privacy@gimmehttp.com">privacy@gimmehttp.com</a><br />
        <strong>Website:</strong> <a href="https://gimmehttp.com">gimmehttp.com</a>
      </p>
    </div>
  </div>
</template>
