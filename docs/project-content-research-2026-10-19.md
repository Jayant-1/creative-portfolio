# Project content research

Reviewed October 18–19, 2026. Scope: the five project case studies, their homepage summaries, and related project metadata. This is a content review, not a complete functional, security, or clinical audit of the linked applications.

## Editorial approach

- Keep the recognizable project names as identity labels, and use dedicated headlines for the homepage cards and case-study H1s. Search and sharing titles combine the project name with its headline.
- Write in first person, preserving solo ownership for AstroPixel and the 3D Portfolio, and team leadership for Krypton, Malaria Detection System, and NeuralNet.
- Explain the audience and problem in “why I built it,” the implementation in “how I approached it,” and the personal contribution separately.
- Use the existing three build-note cards for alternatives, an explicit USP, and a technical lesson. Comparisons describe a specific scope or workflow; they do not claim market leadership.
- Retain the user-confirmed awards. Awards, feature counts, and configuration weights are not performance benchmarks.
- Add no benchmark or test-result section: no sufficiently documented measurement was found in the sources inspected. A promotional number or test script alone is not a verified result.
- AstroPixel’s lesson about repeated attempts and correct tile loading was supplied directly by Jayant. The other lessons are technical reflections grounded in the implementation, without invented incidents, customer outcomes, or test runs.

## AstroPixel

**Positioning:** an integrated image-ingestion, tile-preparation, viewing, and annotation workflow for detailed imagery.

Repository snapshot: `2abe8720d5260d3149958638e18ee973e92aa518`.

- [Dataset processing](https://github.com/Jayant-1/AstroPixel/blob/2abe8720d5260d3149958638e18ee973e92aa518/Backend/app/services/dataset_processor.py): background processing, progress, resource checks, primary and fallback generators.
- [Tile generation](https://github.com/Jayant-1/AstroPixel/blob/2abe8720d5260d3149958638e18ee973e92aa518/Backend/app/services/perfect_tile_generator.py): multiresolution tiles, Pillow processing and optional Rasterio windowed reads. The active pipeline should not be described as exclusively GDAL’s `gdal2tiles`.
- [Tile delivery](https://github.com/Jayant-1/AstroPixel/blob/2abe8720d5260d3149958638e18ee973e92aa518/Backend/app/routers/tiles.py): cache, optional R2 delivery, and local fallbacks.
- [Viewer](https://github.com/Jayant-1/AstroPixel/blob/2abe8720d5260d3149958638e18ee973e92aa518/Frontend/src/pages/Viewer.jsx): image exploration and viewer controls.

**Live observation:** [AstroPixel](https://astropixel.jayant.codes/) opened successfully. “Start Exploring” led to the explorer, with filters, upload controls, and an empty dataset state. No image was uploaded. Actual deep-zoom behavior on a processed public dataset could not be verified in that session.

**Comparison basis:** [OpenSeadragon](https://openseadragon.github.io/) already provides deep zoom and an ecosystem of viewer extensions. The portfolio therefore credits the application workflow around the viewer, rather than presenting tiled zoom as a new invention.

**Excluded:** frame-rate, memory, load-time, throughput, and maximum-image-size claims without a reproducible measurement or demonstrated dataset.

## Krypton

**Positioning:** paper discovery with an inspectable ranking implementation and abstract-based reading assistance.

Repository snapshot: `18e0ea73bbe39a4f4463e727882387f9d6f72be2`.

- [Ranking service](https://github.com/Jayant-1/Krypton/blob/18e0ea73bbe39a4f4463e727882387f9d6f72be2/app/services/ranking_service.py): default 40% TF-IDF relevance, 30% recency, and 30% normalized logarithmic citation score. Preferences adjust the weights. These percentages describe configuration, not measured search quality.
- [Search route](https://github.com/Jayant-1/Krypton/blob/18e0ea73bbe39a4f4463e727882387f9d6f72be2/app/routers/search.py): concurrent source requests, citation enrichment, cache handling, and ranking. No deduplication claim was added.
- [AI service](https://github.com/Jayant-1/Krypton/blob/18e0ea73bbe39a4f4463e727882387f9d6f72be2/app/services/ai_service.py): abstract-based Gemini assistance.
- [API exercise script](https://github.com/Jayant-1/Krypton/blob/18e0ea73bbe39a4f4463e727882387f9d6f72be2/test_api.py): not evidence of a saved passing test run or latency improvement.

**Live observation:** [Krypton](https://krypton.jayant.codes/) displayed its research interface, onboarding, and sample reading plan. It also displayed a backend-offline message. The sample plan’s scores were not treated as evaluation results. No account was created.

**Comparison basis:** [Semantic Scholar’s ranking description](https://webflow.semanticscholar.org/faq/ranking-function) and [Elicit Search](https://elicit.com/solutions/search) show that ranking and research assistance already exist elsewhere. The copy focuses on Krypton’s inspectable implementation and combined workflow, with no claim of superior coverage or relevance.

**Excluded:** the former 62% latency claim, “zero hallucination” claims, and any claim that the entire live backend was verified working.

## 3D Portfolio

**Positioning:** interaction design demonstrated through the portfolio itself, with a separate mobile skills interface.

Repository snapshot: `cbe4cdf565f80075258fb19a5af10aa7dc9fd020`.

- [Skills keyboard](https://github.com/Jayant-1/3D-Portfolio/blob/cbe4cdf565f80075258fb19a5af10aa7dc9fd020/src/components/SkillKeyboard.jsx): Spline desktop integration, key/hover events, and a DOM keycap grid with categories on mobile.
- [Workstation scene](https://github.com/Jayant-1/3D-Portfolio/blob/cbe4cdf565f80075258fb19a5af10aa7dc9fd020/src/components/canvas/Computers.jsx): rotation interaction, touch handling, screen-dependent pixel ratio, and shadow settings.
- [Application composition](https://github.com/Jayant-1/3D-Portfolio/blob/cbe4cdf565f80075258fb19a5af10aa7dc9fd020/src/App.jsx): scenes, project sections, achievements, skills, and contact.

**Live observation:** [3D Portfolio](https://3dportfolio.jayant.codes/) loaded its navigation and content, including project cards, achievements, skills, résumé access, and contact fields. This was not a frame-rate or cross-device performance test. Contact forms were not submitted.

**Comparison basis:** [Spline’s code-export documentation](https://docs.spline.design/exporting-your-scene/web/exporting-as-code) supports the distinction between publishing a scene and integrating one into a complete React application. No unsupported claim of conversion improvement or superiority over other portfolios was added.

**Excluded:** guaranteed 60 FPS, universal smoothness, and “from scratch” wording that could imply authorship of every underlying library or scene asset.

## Malaria Detection System

**Positioning:** an academic demonstration of connecting image inference to records and reporting.

Repository snapshot: `71f8dd14905cdead8bb83865e10b17e096e8db65`.

- [Prediction workflow](https://github.com/Jayant-1/MalariaDetectionSystem/blob/71f8dd14905cdead8bb83865e10b17e096e8db65/backend/app.py): image handling, patient/sample association, inference, saved predictions, and low-memory behavior.
- [Preprocessing](https://github.com/Jayant-1/MalariaDetectionSystem/blob/71f8dd14905cdead8bb83865e10b17e096e8db65/backend/preprocess.py): RGB, contrast-enhanced RGB, and edge channels.
- [Inference](https://github.com/Jayant-1/MalariaDetectionSystem/blob/71f8dd14905cdead8bb83865e10b17e096e8db65/backend/inference.py): actual Keras prediction calls, optional uncertainty/Grad-CAM paths, and low-memory restrictions.
- [PDF generation](https://github.com/Jayant-1/MalariaDetectionSystem/blob/71f8dd14905cdead8bb83865e10b17e096e8db65/frontend/src/utils/pdfGenerator.js): jsPDF report generation from record and result data.

**Live observation:** [Malaria Detection](https://malariadetection.jayant.codes/) loaded its landing page and detection upload screen. No patient data or images were uploaded, and no clinical inference was evaluated.

**Comparison scope:** a classifier-only notebook versus a connected application workflow. The portfolio does not claim superiority to medical diagnostic products or clinical practice.

**Excluded:** the live landing page’s accuracy, hospital, patient, time-saving, compliance, and certification claims. The inspected sources did not supply supporting evaluation reports or external verification. The previously mentioned 94% figure also lacks enough evaluation context to publish as a benchmark. The user confirmed that the project has not been clinically tested.

## NeuralNet

**Positioning:** a visual architecture-to-code prototype with a clear boundary between generation and execution.

Repository snapshot: `053788bf9a9860fcd9e484c4e64e06f333b04fbc`.

- [Graph compiler](https://github.com/Jayant-1/NeuralNet/blob/053788bf9a9860fcd9e484c4e64e06f333b04fbc/backend/services/graph_compiler.py): topological ordering and Python AST generation for Keras Sequential models. Ordering does not establish support for arbitrary branched graphs.
- [Frontend graph checks](https://github.com/Jayant-1/NeuralNet/blob/053788bf9a9860fcd9e484c4e64e06f333b04fbc/frontend/src/utils/graphToJson.js): input/output, disconnected-node, and cycle checks used by the training flow. This does not justify claiming comprehensive backend validation.
- [Editor code generation](https://github.com/Jayant-1/NeuralNet/blob/053788bf9a9860fcd9e484c4e64e06f333b04fbc/frontend/src/utils/codeGenerator.js): Keras and PyTorch previews.
- [Compile route](https://github.com/Jayant-1/NeuralNet/blob/053788bf9a9860fcd9e484c4e64e06f333b04fbc/backend/routes/compile.py): source generation is implemented; TensorFlow model validation is disabled.
- [Training route](https://github.com/Jayant-1/NeuralNet/blob/053788bf9a9860fcd9e484c4e64e06f333b04fbc/backend/routes/training.py) and [prediction route](https://github.com/Jayant-1/NeuralNet/blob/053788bf9a9860fcd9e484c4e64e06f333b04fbc/backend/routes/predict.py): simulated metrics and prediction responses. The training path does not save a trained model.

**Live observation:** [NeuralNet](https://neuralnet.jayant.codes/) loaded the public product presentation. “Enter Command Center” led to sign-in. No account was created; authenticated editor operation was not verified live. Implementation statements are supported by source inspection, not an authenticated production test.

**Comparison basis:** [TensorFlow Playground](https://playground.tensorflow.org/) provides an educational network visualization; [Keras Sequential documentation](https://keras.io/guides/sequential_model/) defines the plain-stack model scope. The copy positions NeuralNet around editable architecture and inspectable source.

**Excluded:** trained-model accuracy, production inference, measured inference latency, universal graph validity, and automatic production deployment claims.

## Local verification of the initial rewrite

- Typecheck, lint, production build, and diff whitespace checks passed.
- Rebuilt and started the local production server on port 3000.
- All five case-study routes returned HTTP 200 with the new section labels, their intended canonical URLs, and matching visible summaries, meta descriptions, and case-study schema descriptions.
- The homepage rendered all five rewritten summaries and five “Read my case study” links.
- Visually checked the NeuralNet header and build notes at 1440 px, the Malaria Detection header at 390 px, and the homepage AstroPixel card at 390 px. The sampled pages had no document-level horizontal overflow.
- These checks cover the content change and sampled layouts. They do not establish cross-browser support, project-demo uptime, or project benchmark results.
- This change does not publish to the production domains.

## Second editorial pass — October 19, 2026

The user requested a stronger rewrite against the same seven criteria. All five GitHub HEADs were checked again and matched the snapshots above. The active processing, ranking, inference, compiler, and interface files were fetched again. The public demo entry points were revisited; this did not supply new benchmark evidence or establish authenticated end-to-end operation.

The revision removes temporary audit observations from the portfolio narrative. Observed availability remains documented above; actual scope boundaries remain in the case studies, including simulated NeuralNet execution and the malaria project's lack of clinical validation.

| Project | Visible headline | Reader benefit / USP |
| --- | --- | --- |
| AstroPixel | Space, Pixel by Pixel | Explore detailed imagery and keep observations attached to image locations. |
| Krypton | Find Your Next Paper | Assemble an initial reading list using explicit ranking signals and abstract summaries. |
| 3D Portfolio | My Skills in Motion | Try the interaction work directly, including a skills interface adapted for touch. |
| Malaria Detection System | From Cell Image to Report | Inspect the software connecting an image prediction, its record, and its report. |
| NeuralNet | Draw a Network. Get the Code. | Connect a visual architecture to inspectable, exportable model code. |

### Where each requested point appears

1. **Title:** new `headline` field, rendered as the case-study H1 and homepage card heading. Project names remain visible in breadcrumbs and the homepage card eyebrow.
2. **Description:** the homepage summary and case-study introduction explain a recognizable problem and the proposed software workflow.
3. **Why use it:** “why I built it” identifies the audience, task, and reason to use or inspect the project. No adoption, paid customers, or willingness-to-pay is invented.
4. **Competition:** the first build-note card compares the scope with relevant alternatives. The comparison is narrow enough to support from code and official product documentation.
5. **USP:** the second build-note card explicitly identifies the combination of capabilities that defines the project.
6. **Learning:** the third build-note card describes the technical takeaway, grounded in the implementation and the user's AstroPixel account.
7. **Benchmarks/testing results:** omitted where unsupported, as the user previously requested. The ranking weights, feature counts, awards, demo fixtures, and simulated metrics are not presented as benchmarks.

Short, project-specific search descriptions are now separate from the longer visible summary. Structured data retains the visible summary and uses the same editorial headline. Styling, animation, section order, project URLs, and media remain unchanged by this pass.

### Verification of the second pass

- The production build passed, including TypeScript and ESLint checks, after removing orphaned code from a concurrently disabled preloader. Its disabled behavior was preserved; no preloader was reintroduced.
- All five local case-study routes returned HTTP 200. Their H1s, descriptions, summaries, and structured-data headlines matched the revised content source.
- All five homepage headlines and problem/solution summaries were verified in the rendered HTML.
- All five case-study H1s and homepage card headings fitted their containers at a 390 px viewport, with no heading overflow. Representative desktop and mobile screenshots were inspected.
- The local production server was refreshed on port 3000. No deployment to the public domains was performed.
