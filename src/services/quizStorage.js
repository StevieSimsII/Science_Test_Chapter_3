import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

// Azure Storage account configuration
const account = process.env.REACT_APP_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.REACT_APP_STORAGE_ACCOUNT_KEY;
const tableName = "quizresults";

// Create credentials and table client
const credential = new AzureNamedKeyCredential(account, accountKey);
const tableClient = new TableClient(
  `https://${account}.table.core.windows.net`,
  tableName,
  credential
);

// Test function to verify connection
export const testConnection = async () => {
  try {
    // Try to create the table if it doesn't exist
    await tableClient.createTable();
    console.log("Successfully connected to Azure Table Storage");
    return true;
  } catch (error) {
    if (error.statusCode === 409) {
      // Table already exists, which is fine
      console.log("Table already exists, connection successful");
      return true;
    }
    console.error("Error connecting to Azure Table Storage:", error);
    throw error;
  }
};

// Function to store quiz results
export const storeQuizResults = async (userId, lessonId, score, answers) => {
  try {
    // Create a unique timestamp for the quiz attempt
    const timestamp = new Date().toISOString();
    
    // Create the quiz result entity
    const quizResult = {
      partitionKey: userId,
      rowKey: timestamp,
      lessonId: lessonId,
      score: score,
      totalQuestions: Object.keys(answers).length,
      timestamp: timestamp
    };

    // Store the quiz result
    await tableClient.createEntity(quizResult);

    // Store individual question responses
    for (const [questionId, answer] of Object.entries(answers)) {
      const questionResponse = {
        partitionKey: `${userId}_${timestamp}`,
        rowKey: questionId,
        answer: answer,
        timestamp: timestamp
      };
      await tableClient.createEntity(questionResponse);
    }

    return true;
  } catch (error) {
    console.error("Error storing quiz results:", error);
    throw error;
  }
};

// Function to get quiz results for a user
export const getQuizResults = async (userId) => {
  try {
    const results = [];
    const entities = tableClient.listEntities({
      queryOptions: { filter: `PartitionKey eq '${userId}'` }
    });

    for await (const entity of entities) {
      results.push(entity);
    }

    return results;
  } catch (error) {
    console.error("Error retrieving quiz results:", error);
    throw error;
  }
};

// Function to get detailed question responses for a specific quiz attempt
export const getQuizAttemptDetails = async (userId, timestamp) => {
  try {
    const responses = [];
    const entities = tableClient.listEntities({
      queryOptions: { filter: `PartitionKey eq '${userId}_${timestamp}'` }
    });

    for await (const entity of entities) {
      responses.push(entity);
    }

    return responses;
  } catch (error) {
    console.error("Error retrieving quiz attempt details:", error);
    throw error;
  }
}; 