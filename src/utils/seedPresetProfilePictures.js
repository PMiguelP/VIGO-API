const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const seedPresetProfilePictures = async () => {
  const presetPictures = [
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/ThePartyKing-C6syTgbemXDIk82vcwYC0Aei7i5hHA.jpeg",
      description: "The Party King",
      category: "Party Squad",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheDriknQueen-6H90KtdjXT5NElTDxyxFtzFQ4lpsEi.jpeg",
      description: "The Drink Queen",
      category: "Party Squad",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheDjPro-9JMfaH30hxhKayL91ol6nqtZCVWjk9.jpeg",
      description: "The DJ Pro",
      category: "Party Squad",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/Thednacemachine-NDfmaxv3niZddTXejhe5oxISI8cjdl.jpeg",
      description: "The Dance Machine",
      category: "Party Squad",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheKaraokeStar-9Edh0JCl9ORPH6BibdRZSilG51zoUf.jpeg",
      description: "The Karaoke Star",
      category: "Party Squad",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheSmoothCharmer-B60S24TTHUAirNd2Ed2eQwax48nRw1.jpeg",
      description: "The Smooth Charmer",
      category: "Elegant Crew",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheNightDiva-xYrOpQ8rV1KYS5Q3YPb6ZoB5vXqEqS.jpeg",
      description: "The Night Diva",
      category: "Elegant Crew",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheSecretModel-4rPB6xbMsHaYzzqCn7zLuzWWApaEtZ.jpeg",
      description: "The Secret Model",
      category: "Elegant Crew",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/MR.Style-TZXUU84JqpA6cTbJSqxWTUtzmQOtwv.jpeg",
      description: "Mr. Style",
      category: "Elegant Crew",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheElegantPrincess-2M9D6nNP8R0vQvzmeLpmcWBs1JFzpB.jpeg",
      description: "The Elegant Princess",
      category: "Elegant Crew",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheWildOne-Gh2Bt3CAFt3lO1quOmly7fElepYsSZ.jpeg",
      description: "The Wild One",
      category: "The Wild Squad",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheAdventureHunter-wOpk4cHdh2GLteUNea1GOKDTo7biJ3.jpeg",
      description: "The Adventure Hunter",
      category: "The Wild Squad",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheNoiseKing-dAKseUT6QKvkIySoJh0GlG1R7ZgCQL.jpeg",
      description: "The Noise King",
      category: "The Wild Squad",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheEnergyBomb-ibBev19axBf6EIh3cTDpVBmFEUAM8W.jpeg",
      description: "The Energy Bomb",
      category: "The Wild Squad",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheNightWarrior-eWerYpEwLMeYnn5cxcVUedopS5jB2G.jpeg",
      description: "The Night Warrior",
      category: "The Wild Squad",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheLivingMeme-1BZEGQQjloVUsDgN2JYx7dS6QLtQCF.jpeg",
      description: "The Living Meme",
      category: "Memes and Jokes",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheDrinkLegend-fDqfvKtX9vUrIHwZuEN1ysFyydy36V.jpeg",
      description: "The Drink Legend",
      category: "Memes and Jokes",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheInvisibleFriend-C6CVb1ntp0P2r6ghWXXvPHjkt4EgMw.jpeg",
      description: "The Invisible Friend",
      category: "Memes and Jokes",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheGroupClown-bxSqlHto4GN22aOzo4xjfJnHK62TBF.jpeg",
      description: "The Group Clown",
      category: "Memes and Jokes",
    },
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/TheFamousStranger-vbiDZL9b1foc8irx6xw4YmdS7ymfVn.jpeg",
      description: "The Famous Stranger",
      category: "Memes and Jokes",
    },
  ];

  try {
    console.log("Seeding preset profile pictures...");
    await prisma.presetProfilePicture.createMany({
      data: presetPictures,
      skipDuplicates: true,
    });
    console.log("Preset profile pictures seeded successfully!");
  } catch (error) {
    console.error("Error seeding preset profile pictures:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedPresetProfilePictures();
