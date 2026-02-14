# 🦷 DentalSens-RWE: Estudio de Evidencia del Mundo Real sobre Hipersensibilidad Dentinal V.1.2

Bienvenido al repositorio oficial de **DentalSens-RWE**, una aplicación web progresiva (PWA) diseñada para la recolección de Datos del Mundo Real (RWD) sobre la hipersensibilidad dentinal (HD) en Colombia.

## 📖 Descripción del Proyecto
Este proyecto es un estudio de cohorte observacional, prospectivo y digital. Su objetivo es caracterizar la carga de la enfermedad y la evolución de la hipersensibilidad dentinal fuera de los entornos clínicos controlados. 

Los datos del mundo real (RWD) pueden generarse a partir de datos reportados por el paciente, incluyendo entornos de uso doméstico y dispositivos móviles. Esta herramienta permite capturar precisamente esa experiencia en tiempo real, identificando patrones de dolor, desencadenantes y variaciones geográficas para generar Evidencia del Mundo Real (RWE).

## 🎯 Objetivos de la Aplicación
* **Captura de PROs (Patient-Reported Outcomes):** Medir la intensidad del dolor utilizando la escala Visual Análoga (VAS) de 0-10 y registrar los estímulos desencadenantes (frío, calor, dulce, cepillado).
* **Seguimiento Longitudinal:** Permitir a los usuarios registrar sus síntomas históricamente para visualizar la evolución del manejo de la sensibilidad.
* **Caracterización Demográfica:** Mapear la prevalencia y los factores de riesgo de la HD en diversas regiones de Colombia, integrando variables clínicas como diagnóstico previo e higiene oral.
* **Educación en Salud:** Proveer un módulo de aprendizaje con recomendaciones basadas en evidencia para el manejo de la condición.

## 🛠️ Stack Tecnológico
* **Frontend:** React + Vite
* **Estilos:** Tailwind CSS (Diseño UI/UX clínico y accesible)
* **Gráficos:** Recharts (Visualización longitudinal de síntomas)
* **Backend y Base de Datos:** Supabase (PostgreSQL & Autenticación)
* **Despliegue:** GitHub Pages

## 🚀 Funcionalidades Principales
1. **Módulo de Consentimiento:** Aceptación obligatoria de términos, condiciones y consentimiento informado (e-Consent) regulado éticamente previo al registro.
2. **Autenticación Segura:** Sistema de login/registro con recuperación de contraseña gestionado por Supabase Auth.
3. **Registro Demográfico y Basal:** Cuestionario inicial de única vez para segmentación epidemiológica (Edad, Género, Ciudad, Hábitos, Antecedentes dentales).
4. **Diario de Sensibilidad (Tracker):** Interfaz para ingreso de nivel de dolor y factores desencadenantes.
5. **Dashboard Interactivo:** Gráficas de líneas que muestran la tendencia de los síntomas a lo largo del tiempo.
6. **Modulo de Aprendizaje:** Segmento enfocado a enseñar sobre la condición y como manejarlo.
7. **Sección Experto:** Contacta a un Experto. Resuelve tus dudas con nuestro personal de salud.

# Cambios en V.1.2
1. Dashboard Investigador
2. Acceso Profesional de la salud para dar input o diagnósticos

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# **INFORME TÉCNICO-CIENTÍFICO: JUSTIFICACIÓN METODOLÓGICA PARA EL DISEÑO DE HERRAMIENTA DIGITAL EN ESTUDIO DE EVIDENCIA DEL MUNDO REAL (RWE) SOBRE HIPERSENSIBILIDAD DENTINAL**

**1. INTRODUCCIÓN**
La investigación clínica tradicional, dominada por los Ensayos Clínicos Aleatorizados (ECA), se realiza en entornos controlados que a menudo excluyen a poblaciones con comorbilidades o características demográficas diversas, limitando la generalización de los hallazgos [1, 2]. La Evidencia del Mundo Real (RWE), generada a partir del análisis de Datos del Mundo Real (RWD), permite complementar estos vacíos al capturar la experiencia del paciente en su rutina diaria y el curso natural de la enfermedad [1].

Este informe sustenta el diseño de la aplicación móvil "DentalSens-RWE" como instrumento de recolección de datos generados por el paciente (Patient-Generated Health Data - PGHD), alineándose con las directrices internacionales para estudios observacionales y protocolos RWE.

**2. SUSTENTACIÓN DEL DISEÑO DE INTERFAZ (UX) PARA EL PACIENTE**
El diseño de la interfaz de usuario se fundamenta en la necesidad de minimizar la carga sobre el participante para garantizar la adherencia y la calidad del dato, dado que los estudios RWE no deben alterar la práctica clínica rutinaria ni imponer procedimientos rígidos propios de un ensayo clínico [2].

* **Enfoque No Intervencional:** A diferencia de los protocolos de tratamiento fijo en los ECA, la interfaz de la aplicación está diseñada para la recolección flexible de datos [2]. Se prioriza una navegación intuitiva que permita al usuario registrar eventos de dolor en tiempo real, lo cual es una ventaja distintiva de los RWD obtenidos mediante dispositivos móviles frente a las visitas clínicas esporádicas [1].
* **Escalas de Medición Validadas (VAS):** La interfaz incorpora una Escala Visual Análoga (VAS) digital para la evaluación del dolor. La literatura clínica sobre hipersensibilidad dentinal (HD) valida el uso de la escala VAS (o escala de Schiff) como el estándar para cuantificar la respuesta a estímulos (frío, aire, táctil) en ensayos clínicos controlados [3, 4, 5]. La digitalización de esta escala en la app asegura consistencia con la literatura científica previa.
* **Visualización Longitudinal:** La inclusión de gráficos de evolución en la interfaz del paciente responde a la capacidad única de los estudios RWE para evaluar resultados a largo plazo y patrones de tratamiento, superando la corta duración típica de los ECA [1].

**3. JUSTIFICACIÓN DE LAS VARIABLES DEMOGRÁFICAS**
La inclusión de un módulo de registro demográfico detallado (edad, género, ubicación) es crítica para la validez externa y el análisis epidemiológico del estudio.

* **Representatividad Poblacional:** Los ECA suelen excluir a poblaciones específicas (ej. adultos mayores con múltiples patologías), lo que resulta en tasas de eventos adversos o perfiles de eficacia que no reflejan la realidad [1]. La recolección de datos demográficos permite estratificar la muestra y analizar subgrupos, identificando patrones de utilización y efectividad en poblaciones más amplias y diversas que las estudiadas en fases pre-comercialización [2, 6].
* **Factores Confusores:** La literatura epidemiológica sugiere que la prevalencia y percepción de la sensibilidad puede variar según factores poblacionales. Capturar estas variables permite realizar ajustes estadísticos (ej. Propensity Scores) para mitigar sesgos en estudios no aleatorizados [6].

**4. SUSTENTACIÓN DE ANTECEDENTES Y DIAGNÓSTICO DIFERENCIAL**
Dado que la aplicación depende del auto-reporte sin un examen clínico físico inmediato, el cuestionario de antecedentes (diagnóstico diferencial) actúa como un filtro de calidad indispensable para asegurar que los síntomas reportados correspondan a Hipersensibilidad Dentinal y no a otra patología.

* **Criterios de Exclusión/Validación:** En los ensayos clínicos de desensibilizantes (ej. estudios sobre biovidrios o arginina), es estándar excluir a pacientes con caries, enfermedad periodontal, dientes fracturados o tratamiento de blanqueamiento reciente, ya que estas condiciones presentan dolor dental que confunde el diagnóstico de HD [3, 5].
* **Validez del Dato (Fitness-for-purpose):** Para que los datos RWD sean aptos para la toma de decisiones regulatorias o clínicas, deben ser robustos y relevantes [6]. Preguntar sobre "Antecedente de bruxismo" o "Consumo de dieta ácida" permite identificar covariables que exacerban la pérdida de esmalte o la exposición dentinal, diferenciando la etiología del dolor [3]. Sin estas preguntas de validación, el dataset carecería de la especificidad necesaria para atribuir el dolor a la hipersensibilidad dentinal pura.

**5. CONCLUSIÓN**
El diseño de la aplicación propuesta no es arbitrario; obedece a la necesidad metodológica de replicar el rigor de los criterios de selección de los ensayos clínicos [3, 4] dentro de un entorno observacional digital flexible [2]. La captura de demografía y comorbilidades dentales asegura que la evidencia generada sea representativa y científicamente válida para caracterizar la hipersensibilidad dentinal en la población colombiana.

---

**REFERENCIAS BIBLIOGRÁFICAS (FORMATO VANCOUVER)**

1. Chodankar D. Introduction to real-world evidence studies. Perspect Clin Res. 2021;12(3):171-174. [Fuente: PCR-12-171.pdf]
2. Bassel M, Sayegh L, Fernandes S, Saragoussi D. Protocol Design in Real-World Evidence: The Indispensable Link Between Strategic Need and Study Execution. The Evidence Forum. 2019;Fall:11-16. [Fuente: 06-Protocol-Design-in-Real-World-Evidence_Fall2019_updated_12-2019.pdf]
3. Arshad S, Zaidi SJA, Farooqui WA. Comparative efficacy of BioMin-F, Colgate Sensitive Pro-relief and Sensodyne Rapid Action in relieving dentin hypersensitivity: a randomized controlled trial. BMC Oral Health. 2021;21:498. [Fuente: s12903-021-01864-x.pdf]
4. Jang JH, Oh S, Kim HJ, Kim DS. A randomized clinical trial for comparing the efficacy of desensitizing toothpastes on the relief of dentin hypersensitivity. Sci Rep. 2023;13:7523. [Fuente: s41598-023-31616-6.pdf]
5. Acharya AB, Surve SM, Thakur SL. A clinical study of the effect of calcium sodium phosphosilicate on dentin hypersensitivity. J Clin Exp Dent. 2013;5(1):e18-22. [Fuente: jced-5-e18.pdf]
6. European Medicines Agency (EMA), Heads of Medicines Agencies (HMA). Real-world evidence provided by EMA: Support for regulatory decision-making. EMA/152628/2024. 2024 April 10. [Fuente: guide-real-world-evidence-provided-ema-support-regulatory-decision-making_en.pdf]
