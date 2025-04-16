# Student Evaluatie Tool

Een moderne web-applicatie om het beheer van taken, toetsen en stagedagboeken voor docenten en studenten te vereenvoudigen. Dit project is ontwikkeld door [Matti](https://github.com/MattiVboiii) en [Quinten](https://github.com/DQuinn97).

## Projectbeschrijving

Deze applicatie biedt docenten en studenten een gebruiksvriendelijk platform om het beheer van taken en toetsen efficiënter te maken. Met een moderne technologie-stack en een goed gestructureerd systeem zorgt de applicatie voor een naadloze ervaring voor beide gebruikersgroepen. De toevoeging van het stagedagboek stelt studenten in staat om hun stage-ervaringen te documenteren en eenvoudig te beheren.

## Functionaliteiten

### Algemeen

- **Gebruikersbeheer**: Registratie, inloggen, profielbeheer met foto upload
- **Responsief ontwerp**: Volledig bruikbaar op desktop en mobiele apparaten
- **Donkere/lichte modus**: Aanpasbare UI-thema's voor gebruikerscomfort

### Voor Studenten

- **Dashboard**: Overzicht van taken/toetsen met voortgang en statistieken
- **Taakbeheer**: Inzien, indienen en bijlagen uploaden bij taken
- **Stagedagboek**: Dagelijkse stage-ervaringen documenteren en bijhouden
- **Stageverslag**: Reflecteren op stage-ervaring met uitgebreide evaluatie

### Voor Docenten

- **Klasgroepbeheer**: Aanmaken en beheren van klassen en studenten
- **Taakbeheer**: Creëren, publiceren en beoordelen van taken/toetsen
- **Inzendingenbeheer**: Beoordeling van studenteninzendingen met feedback
- **Stagedagboekbeoordeling**: Inzien en beoordelen van studentenstagedagboeken

## Technische Stack

### Frontend (deze repository)

- **Framework**: React + TypeScript
- **Build tool**: Vite voor snelle ontwikkeling en optimale productiebouwbestanden
- **UI Components**: Eigen component library gebaseerd op Shadcn/UI
- **Styling**: Tailwind CSS voor responsive design
- **State Management**: React Context API en custom hooks
- **Routing**: React Router voor navigatie
- **Formulieren**: React Hook Form + Zod voor validatie
- **Data Fetching**: Axios voor API-communicatie

### Backend ([aparte repository](https://github.com/DQuinn97/Student-Evaluatie-Tool-Backend))

- **Runtime**: Node.js met Express
- **Taal**: TypeScript voor type-veiligheid
- **Database**: MongoDB met Mongoose ODM
- **Authenticatie**: JWT-tokens voor beveiligde toegang
- **API Documentatie**: Swagger/OpenAPI
- **File Uploads**: Cloudinary integratie voor bestandsopslag

## Installatie

1. Clone deze repository:

```bash
git clone https://github.com/DQuinn97/Student-Evaluatie-Tool.git
cd Student-Evaluatie-Tool
```

2. Installeer dependencies:

```bash
npm install
```

3. Start de ontwikkelomgeving:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in je browser

## Vereisten

- Node.js (v18 of hoger)
- npm (v9 of hoger)
- Backend API draaiend op [http://localhost:3000](http://localhost:3000)

## Backend Setup

Voor de volledige functionaliteit is de bijbehorende backend vereist:

1. Clone de backend repository:

```bash
git clone https://github.com/DQuinn97/Student-Evaluatie-Tool-Backend.git
cd Student-Evaluatie-Tool-Backend
```

2. Volg de installatie-instructies in de backend README.md

## Bijdragen

Dit project is ontwikkeld als vervangende stageopdracht voor de opleiding Full Stack Developer bij Syntra.
