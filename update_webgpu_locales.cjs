const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'utils', 'i18n', 'locales');
const locales = fs.readdirSync(localesDir);

const newTranslations = {
  'en': {
    extensions: {
      EXT_texture_filter_anisotropic: 'Improves quality of textures on surfaces viewed at oblique angles.',
      WEBGL_debug_renderer_info: 'Exposes the underlying graphics hardware and driver information.',
      OES_vertex_array_object: 'Encapsulates vertex array state into objects for faster switching.',
      WEBGL_compressed_texture_s3tc: 'Exposes S3TC (DXT) compressed texture formats.',
      WEBGL_compressed_texture_etc: 'Exposes ETC2 and EAC compressed texture formats.',
      WEBGL_compressed_texture_astc: 'Exposes ASTC compressed texture formats.',
      ANGLE_instanced_arrays: 'Allows drawing the same object multiple times with different data.',
      OES_texture_float: 'Allows using floating point numbers for texture data.',
      OES_texture_half_float: 'Allows using half-floating point numbers for texture data.',
      WEBGL_depth_texture: 'Allows using depth buffers as textures.',
      EXT_shader_texture_lod: 'Adds texture lookup functions with explicit LOD control in shaders.',
      OES_standard_derivatives: 'Adds standard derivative functions (dFdx, dFdy, fwidth) to shaders.',
      WEBGL_draw_buffers: 'Allows drawing to multiple color buffers at once (MRT).',
      EXT_frag_depth: 'Allows the fragment shader to set the depth value.',
      WEBGL_lose_context: 'Simulates losing and restoring the WebGL context for testing.',
      EXT_blend_minmax: 'Adds MIN and MAX blend equations.',
      OES_element_index_uint: 'Allows using unsigned int (32-bit) indices for drawing.',
      EXT_color_buffer_float: 'Allows rendering to 32-bit floating-point color buffers.',
      EXT_float_blend: 'Allows blending with 32-bit floating-point color buffers.'
    },
    webglTool: {
      no_results: "No extensions match",
    },
    graphicsModal: {
      supported_features: "Supported Features",
      no_params_found: "No parameters found matching"
    }
  },
  'zh-CN': {
    extensions: {
      EXT_texture_filter_anisotropic: '提高斜视角观看表面时的纹理质量。',
      WEBGL_debug_renderer_info: '暴露底层图形硬件和驱动程序信息。',
      OES_vertex_array_object: '将顶点数组状态封装到对象中以实现更快的切换。',
      WEBGL_compressed_texture_s3tc: '暴露 S3TC (DXT) 压缩纹理格式。',
      WEBGL_compressed_texture_etc: '暴露 ETC2 和 EAC 压缩纹理格式。',
      WEBGL_compressed_texture_astc: '暴露 ASTC 压缩纹理格式。',
      ANGLE_instanced_arrays: '允许使用不同的数据多次绘制相同对象。',
      OES_texture_float: '允许在纹理数据中使用单精度浮点数。',
      OES_texture_half_float: '允许在纹理数据中使用半精度浮点数。',
      WEBGL_depth_texture: '允许将深度缓冲用作纹理。',
      EXT_shader_texture_lod: '在着色器中添加具有显式 LOD 控制的纹理查找函数。',
      OES_standard_derivatives: '在着色器中添加标准导数函数 (dFdx, dFdy, fwidth)。',
      WEBGL_draw_buffers: '允许一次绘制到多个颜色缓冲 (MRT)。',
      EXT_frag_depth: '允许片段着色器设置深度值。',
      WEBGL_lose_context: '模拟丢失和恢复 WebGL 上下文进行测试。',
      EXT_blend_minmax: '添加 MIN 和 MAX 混合方程。',
      OES_element_index_uint: '允许使用无符号整数 (32位) 索引进行绘制。',
      EXT_color_buffer_float: '允许渲染到 32位 浮点颜色缓冲。',
      EXT_float_blend: '允许与 32位 浮点颜色缓冲进行混合。'
    },
    webglTool: {
      no_results: "没有找到匹配的扩展：",
    },
    graphicsModal: {
      supported_features: "支持的特性",
      no_params_found: "未找到匹配的参数："
    }
  },
  'zh-TW': {
    extensions: {
      EXT_texture_filter_anisotropic: '提高斜視角觀看表面時的紋理品質。',
      WEBGL_debug_renderer_info: '暴露底層圖形硬件和驅動程式資訊。',
      OES_vertex_array_object: '將頂點陣列狀態封裝到物件中以實現更快的切換。',
      WEBGL_compressed_texture_s3tc: '暴露 S3TC (DXT) 壓縮紋理格式。',
      WEBGL_compressed_texture_etc: '暴露 ETC2 和 EAC 壓縮紋理格式。',
      WEBGL_compressed_texture_astc: '暴露 ASTC 壓縮紋理格式。',
      ANGLE_instanced_arrays: '允許使用不同的數據多次繪製相同物件。',
      OES_texture_float: '允許在紋理數據中使用單精度浮點數。',
      OES_texture_half_float: '允許在紋理數據中使用半精度浮點數。',
      WEBGL_depth_texture: '允許將深度緩衝用作紋理。',
      EXT_shader_texture_lod: '在著色器中添加具有顯式 LOD 控制的紋理查找函數。',
      OES_standard_derivatives: '在著色器中添加標準導數函數 (dFdx, dFdy, fwidth)。',
      WEBGL_draw_buffers: '允許一次繪製到多個顏色緩衝 (MRT)。',
      EXT_frag_depth: '允許片段著色器設置深度值。',
      WEBGL_lose_context: '模擬丟失和恢復 WebGL 上下文進行測試。',
      EXT_blend_minmax: '添加 MIN 和 MAX 混合方程。',
      OES_element_index_uint: '允許使用無符號整數 (32位) 索引進行繪製。',
      EXT_color_buffer_float: '允許渲染到 32位 浮點顏色緩衝。',
      EXT_float_blend: '允許與 32位 浮點顏色緩衝進行混合。'
    },
    webglTool: {
      no_results: "沒有找到匹配的擴展：",
    },
    graphicsModal: {
      supported_features: "支援的特性",
      no_params_found: "未找到匹配的參數："
    }
  },
  'zh-HK': {
    extensions: {
      EXT_texture_filter_anisotropic: '提高斜視角觀看表面時的紋理品質。',
      WEBGL_debug_renderer_info: '暴露底層圖形硬件和驅動程式資訊。',
      OES_vertex_array_object: '將頂點陣列狀態封裝到物件中以實現更快的切換。',
      WEBGL_compressed_texture_s3tc: '暴露 S3TC (DXT) 壓縮紋理格式。',
      WEBGL_compressed_texture_etc: '暴露 ETC2 和 EAC 壓縮紋理格式。',
      WEBGL_compressed_texture_astc: '暴露 ASTC 壓縮紋理格式。',
      ANGLE_instanced_arrays: '允許使用不同的數據多次繪製相同物件。',
      OES_texture_float: '允許在紋理數據中使用單精度浮點數。',
      OES_texture_half_float: '允許在紋理數據中使用半精度浮點數。',
      WEBGL_depth_texture: '允許將深度緩衝用作紋理。',
      EXT_shader_texture_lod: '在著色器中添加具有顯式 LOD 控制的紋理查找函數。',
      OES_standard_derivatives: '在著色器中添加標準導數函數 (dFdx, dFdy, fwidth)。',
      WEBGL_draw_buffers: '允許一次繪製到多個顏色緩衝 (MRT)。',
      EXT_frag_depth: '允許片段著色器設置深度值。',
      WEBGL_lose_context: '模擬丟失和恢復 WebGL 上下文進行測試。',
      EXT_blend_minmax: '添加 MIN 和 MAX 混合方程。',
      OES_element_index_uint: '允許使用無符號整數 (32位) 索引進行繪製。',
      EXT_color_buffer_float: '允許渲染到 32位 浮點顏色緩衝。',
      EXT_float_blend: '允許與 32位 浮點顏色緩衝進行混合。'
    },
    webglTool: {
      no_results: "沒有找到匹配的擴展：",
    },
    graphicsModal: {
      supported_features: "支援的特性",
      no_params_found: "未找到匹配的參數："
    }
  },
  'ja': {
    extensions: {
      EXT_texture_filter_anisotropic: '斜めから見た面のテクスチャ品質を向上させます。',
      WEBGL_debug_renderer_info: 'グラフィックハードウェアとドライバ情報を公開します。',
      OES_vertex_array_object: '頂点配列の状態をオブジェクトにカプセル化し、切り替えを高速化します。',
      WEBGL_compressed_texture_s3tc: 'S3TC (DXT) 圧縮テクスチャフォーマットを公開します。',
      WEBGL_compressed_texture_etc: 'ETC2 および EAC 圧縮テクスチャフォーマットを公開します。',
      WEBGL_compressed_texture_astc: 'ASTC 圧縮テクスチャフォーマットを公開します。',
      ANGLE_instanced_arrays: '同じオブジェクトを異なるデータで複数回描画できるようにします。',
      OES_texture_float: 'テクスチャデータに浮動小数点数を使用できるようにします。',
      OES_texture_half_float: 'テクスチャデータに半精度浮点数を使用できるようにします。',
      WEBGL_depth_texture: '深度バッファをテクスチャとして使用できるようにします。',
      EXT_shader_texture_lod: '明示的な LOD 制御を持つテクスチャ検索関数をシェーダに追加します。',
      OES_standard_derivatives: '標準微分関数 (dFdx, dFdy, fwidth) をシェーダに追加します。',
      WEBGL_draw_buffers: '複数のカラーバッファに同時に描画できるようにします (MRT)。',
      EXT_frag_depth: 'フラグメントシェーダで深度値を設定できるようにします。',
      WEBGL_lose_context: 'テストのために WebGL コンテキストの喪失と復元をシミュレートします。',
      EXT_blend_minmax: 'MIN および MAX ブレンド方程式を追加します。',
      OES_element_index_uint: '描画に符号なし整数 (32ビット) インデックスを使用できるようにします。',
      EXT_color_buffer_float: '32ビット浮動小数点カラーバッファへのレンダリングを許可します。',
      EXT_float_blend: '32ビット浮動小数点カラーバッファとのブレンドを許可します。'
    },
    webglTool: {
      no_results: "一致する拡張機能はありません：",
    },
    graphicsModal: {
      supported_features: "サポートされている機能",
      no_params_found: "一致するパラメーターが見つかりません："
    }
  },
  'ru': {
    extensions: {
      EXT_texture_filter_anisotropic: 'Улучшает качество текстур на поверхностях под косым углом.',
      WEBGL_debug_renderer_info: 'Раскрывает информацию о графическом оборудовании и драйверах.',
      OES_vertex_array_object: 'Инкапсулирует состояние массива вершин в объекты для ускорения переключения.',
      WEBGL_compressed_texture_s3tc: 'Раскрывает форматы сжатых текстур S3TC (DXT).',
      WEBGL_compressed_texture_etc: 'Раскрывает форматы сжатых текстур ETC2 и EAC.',
      WEBGL_compressed_texture_astc: 'Раскрывает форматы сжатых текстур ASTC.',
      ANGLE_instanced_arrays: 'Позволяет рисовать один объект несколько раз с уникальными данными.',
      OES_texture_float: 'Разрешает использование чисел с плавающей запятой в текстурах.',
      OES_texture_half_float: 'Разрешает использование полуточных чисел с плавающей запятой в текстурах.',
      WEBGL_depth_texture: 'Позволяет использовать буфер глубины как текстуру.',
      EXT_shader_texture_lod: 'Добавляет функции текстур с контролем LOD в шейдерах.',
      OES_standard_derivatives: 'Добавляет функции стандартных производных в шейдеры.',
      WEBGL_draw_buffers: 'Позволяет рисовать в несколько цветовых буферов одновременно (MRT).',
      EXT_frag_depth: 'Позволяет фрагментному шейдеру задавать значение глубины.',
      WEBGL_lose_context: 'Имитирует потерю и восстановление контекста WebGL.',
      EXT_blend_minmax: 'Добавляет уравнения смешивания MIN и MAX.',
      OES_element_index_uint: 'Разрешает 32-битные индексы при рисовании.',
      EXT_color_buffer_float: 'Разрешает рендеринг в 32-битные буферы с плавающей запятой.',
      EXT_float_blend: 'Разрешает смешивание с 32-битными буферами с плавающей запятой.'
    },
    webglTool: {
      no_results: "Нет расширений по запросу: ",
    },
    graphicsModal: {
      supported_features: "Поддерживаемые возможности",
      no_params_found: "Не найдено параметров по запросу: "
    }
  }
};

for (const loc of locales) {
  const toolsFile = path.join(localesDir, loc, 'tools.ts');
  const modalsFile = path.join(localesDir, loc, 'modals.ts');
  
  if (fs.existsSync(toolsFile)) {
    let content = fs.readFileSync(toolsFile, 'utf-8');
    const tr = newTranslations[loc] || newTranslations['en'];
    
    // Add strings to webglTool
    if (!content.includes('no_results')) {
        content = content.replace(/webglTool:\s*\{/, `webglTool: {\n    no_results: "${tr.webglTool.no_results}",\n    descriptions: ${JSON.stringify(tr.extensions, null, 4).replace(/\n/g, '\n    ')},`);
    }
    
    fs.writeFileSync(toolsFile, content, 'utf-8');
    console.log(`Updated ${loc}/tools.ts`);
  }

  if (fs.existsSync(modalsFile)) {
    let content = fs.readFileSync(modalsFile, 'utf-8');
    const tr = newTranslations[loc] || newTranslations['en'];
    
    if (!content.includes('supported_features')) {
        content = content.replace(/graphicsModal:\s*\{/, `graphicsModal: {\n    supported_features: "${tr.graphicsModal.supported_features}",\n    no_params_found: "${tr.graphicsModal.no_params_found}",`);
    }

    fs.writeFileSync(modalsFile, content, 'utf-8');
    console.log(`Updated ${loc}/modals.ts`);
  }
}
