// src/components/canvas-poisoning/types.ts

export interface PoisoningTranslations {
  title?: string;
  detect?: string;
  desc_title?: string;
  desc?: string;
  status?: string;
  status_idle?: string;
  status_running?: string;
  status_poisoned?: string;
  status_clean?: string;
  run_test?: string;
  testing?: string;
  waiting?: string;
  start_log?: string;
  testing_canvas?: string;
  testing_webgl?: string;
  testing_audio?: string;
  audio_poisoned?: string;
  audio_stable?: string;
  audio_hooked?: string;
  poisoned_log?: string;
  clean_log?: string;
  canvas_mismatch?: string;
  canvas_stable?: string;
  webgl_mismatch?: string;
  webgl_stable?: string;
  audio_mismatch?: string;
  suspicious_base_latency?: string;
  suspicious_output_latency?: string;
  testing_viewport?: string;
  viewport_mismatch?: string;
  viewport_poisoned?: string;
  viewport_stable?: string;
  
  // Font translations:
  tab_render_audio?: string;
  tab_font_farbling?: string;
  font_detection_title?: string;
  font_detection_desc?: string;
  testing_fonts?: string;
  fonts_hooked?: string;
  font_farbling_detected?: string;
  font_shielding_detected?: string;
  fonts_stable?: string;
  testing_font_query?: string;
  font_query_blocked?: string;
  font_query_allowed?: string;
  run_font_test?: string;
  query_local_fonts_hooked?: string;
  query_local_fonts_unsupported?: string;
  font_widths_stable?: string;
  font_differentiation_detected?: string;

  // Geometry translations:
  tab_geometry?: string;
  geometry_detection_title?: string;
  geometry_detection_desc?: string;
  testing_geometry?: string;
  rects_hooked?: string;
  rect_farbling_detected?: string;
  geometry_stable?: string;
  run_geometry_test?: string;

  // Media translations:
  tab_media?: string;
  media_detection_title?: string;
  media_detection_desc?: string;
  testing_media?: string;
  media_hooked?: string;
  media_not_supported?: string;
  media_empty?: string;
  media_poisoned_detected?: string;
  media_stable?: string;
  run_media_test?: string;

  // Hardware translations:
  tab_hardware?: string;
  hardware_detection_title?: string;
  hardware_detection_desc?: string;
  run_hardware_test?: string;
  testing_hardware?: string;
  hardware_cores?: string;
  hardware_memory?: string;
  hardware_memory_gb?: string;
  hardware_testing_concurrency?: string;
  hardware_benchmark_result?: string;
  hardware_concurrency_suspicious?: string;
  hardware_concurrency_normal?: string;
  hardware_concurrency_hooked?: string;
  hardware_memory_suspicious?: string;
  hardware_memory_normal?: string;
  hardware_declared_specs?: string;
  hardware_workers_not_supported?: string;
  hardware_concurrency_completed?: string;
  hardware_benchmark_complete?: string;
  hardware_performance_capped?: string;
  hardware_low_memory_detected?: string;
  hardware_memory_normal_log?: string;
  hardware_unknown_spec?: string;
  hardware_thrs?: string;
  hardware_speedup_label?: string;
  hardware_ops_label?: string;
  hardware_detected_saturation?: string;
  hardware_physical_cores?: string;
  
  // All tab translations
  tab_all?: string;
  all_detection_title?: string;
  all_detection_desc?: string;
  run_all_tests?: string;
  testing_all_steps?: string;
  all_test_summary_title?: string;
}

export interface ExtendedWindow {
  webkitAudioContext?: typeof AudioContext;
  webkitOfflineAudioContext?: typeof OfflineAudioContext;
}
