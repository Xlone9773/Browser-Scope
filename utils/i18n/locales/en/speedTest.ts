
export const speedTest = {
  title: "Network Speed Test",
  start: "Start Test",
  stop: "Stop",
  ping: "Ping",
  jitter: "Jitter",
  download: "Download",
  upload: "Upload",
  latency: "Latency",
  mbps: "Mbps",
  status: {
    idle: "Ready to start",
    ping: "Testing Latency...",
    download: "Testing Download...",
    upload: "Testing Upload...",
    done: "Test Complete",
  },
  settings: {
    backend: "Backend",
    test_size: "Test Size",
    custom_url: "Custom Download URL",
    custom_placeholder: "https://example.com/large-file.zip",
    cors_note: "Note: URL must support CORS. Upload test will be skipped.",
  },
  preset_names: {
    cloudflare: "Cloudflare (Global)",
    cachefly: "CacheFly (Global CDN)",
    ustc_cn: "USTC Mirror (China/Hefei)",
    nju_cn: "NJU Mirror (China/Nanjing)",
    selectel_ru: "Selectel (Russia/St. Petersburg)",
    tele2_kz: "Tele2 (Kazakhstan/Almaty)",
    hetzner_de: "Hetzner (Germany/Falkenstein)",
    hetzner_fi: "Hetzner (Finland/Helsinki)",
    scaleway_fr: "Scaleway (France/Paris)",
    vultr_nj: "Vultr (US East/New Jersey)",
    vultr_la: "Vultr (US West/Los Angeles)",
    vultr_sg: "Vultr (Singapore)",
    vultr_tokyo: "Vultr (Japan/Tokyo)",
    vultr_sydney: "Vultr (Australia/Sydney)",
    custom: "Custom URL"
  }
};
