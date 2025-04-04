# Science Chapter 3 Test Application

This is an interactive quiz application covering human body organization, systems, and their interactions. The test includes three sections:

1. **Body Organization**: Questions about cells, tissues, organs, and organ systems
2. **Systems Interacting**: Questions about how different body systems work together
3. **Webquest Information**: Additional questions about specific body systems and organs

## Features

- Multiple choice questions with immediate feedback
- Progress tracking
- Score calculation
- Advanced questions designed to challenge your understanding
- Quiz results storage in Azure Table Storage

## Technologies Used

- React
- JavaScript
- Tailwind CSS
- Azure Table Storage

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up Azure Storage:
   - Create an Azure Storage account
   - Copy `.env.example` to `.env`
   - Update `.env` with your Azure Storage account credentials
4. Run the application with `npm start`

## Development

To modify questions, edit the `src/data/quizData.js` file.

## Environment Variables

The following environment variables are required:

- `REACT_APP_STORAGE_ACCOUNT_NAME`: Your Azure Storage account name
- `REACT_APP_STORAGE_ACCOUNT_KEY`: Your Azure Storage account access key

Copy `.env.example` to `.env` and update with your values. 