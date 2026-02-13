# 🦷 DentalSens-RWE: Estudio de Evidencia del Mundo Real sobre Hipersensibilidad Dentinal

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


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
