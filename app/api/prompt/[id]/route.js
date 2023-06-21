import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

// GET (read)
export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const prompt = await Prompt.findById(params.id).populate('creator');
    if(!prompt) return new Response('Prompt not found', { status: 404 })
    return new Response(JSON.stringify(prompt), { status: 200 })
  } catch (error) {
    console.log('Failed to fetch the prompt:', error);
    return new Response('Failed to fetch the prompt', { status: 500 })
  }
};

// PATCH (update)
export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json()

  try {
    await connectToDB();
    const existPrompt = await Prompt.findById(params.id);
    if(!existPrompt) return new Response('Prompt not found', { status: 400});
    existPrompt.prompt = prompt;
    existPrompt.tag = tag;
    await existPrompt.save();
    return new Response('Successfully updated the prompt', { status: 200 });
  } catch (error) {
    console.log('Failed to update prompt', error);
    return new Response('Failed to update prompt', { status: 500 });
  }
}
// DELETE (delete)
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();
    await Prompt.findByIdAndRemove(params.id);
    return new Response('Prompt deleted successfully', { status: 200 })
  } catch (error) {
    console.log('Failed to delete prompt', error);
    return Response('Failed to delete prompt', { status: 500 })
  }
}

