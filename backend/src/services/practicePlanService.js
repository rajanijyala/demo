const PracticeTask = require("../models/PracticeTask");

const taskTemplates = [
  "Review fundamentals and write a one-page concept summary.",
  "Record two answers using the STAR structure and review clarity.",
  "Solve one role-specific scenario and document tradeoffs.",
  "Practice a timed explanation of your strongest project.",
  "Create flashcards for weak topics and test recall.",
  "Run a 20-minute mock interview and note hesitation points.",
  "Repeat the interview flow and compare score movement."
];

const generatePracticePlan = async ({ userId, session, feedback }) => {
  await PracticeTask.deleteMany({ user: userId, session: session._id });
  const topics = feedback.recommendedTopics.length ? feedback.recommendedTopics : ["Interview fundamentals"];
  const now = Date.now();
  const tasks = taskTemplates.map((description, index) => ({
    user: userId,
    session: session._id,
    day: index + 1,
    title: `Day ${index + 1}: ${topics[index % topics.length]}`,
    description,
    focusArea: topics[index % topics.length],
    dueDate: new Date(now + index * 24 * 60 * 60 * 1000)
  }));

  return PracticeTask.insertMany(tasks);
};

module.exports = { generatePracticePlan };
