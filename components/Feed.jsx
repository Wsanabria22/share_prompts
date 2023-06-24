'use client';
import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-6 prompt_layout'>
      {data.map(post => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )

};


const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [prompts, setPrompts] = useState([]);

  const fetchPrompts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setPrompts(data);
  };

  useEffect(() =>{
    fetchPrompts();
  }, []);

  console.log('prompts', prompts);

  const handleSubmit = (e) => {
    e.preventDefault();
    const promptsFiltered = filterPrompts(searchText);
    console.log('promptsFiltered',promptsFiltered)
    setSearchResults(promptsFiltered);
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
  };

  const filterPrompts = (text) => {
    const regExp = new RegExp(text, "i");
    return prompts.filter((element) => 
        regExp.test(element.creator.username) ||
        regExp.test(element.prompt) ||
        regExp.test(element.tag)
    )
    //   return prompts.filter((element) => 
    //   (
    //     element.creator.username.includes(text) ||
    //     element.prompt.includes(text) ||
    //     element.tag.includes(text)
    //  ) )
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);
    const promptsFiltered = filterPrompts(tag);
    console.log('promptsFiltered',promptsFiltered)
    setSearchResults(promptsFiltered);
  }

  return (
    <section className='feed'>
      <form onSubmit={handleSubmit}  className='relative w-full flex-center'>
        <input 
          type="text"
          placeholder='Search for a tag or username'
          value={searchText}
          onChange={handleSearchChange}
          // required
          className='search_input peer'
        />
      </form>

      { searchResults.length > 0 ? 
        (
          <PromptCardList
          data={searchResults}
          handleTagClick={handleTagClick}
        />
        ) :
        (
          <PromptCardList
          data={prompts}
          handleTagClick={handleTagClick}
      />
        )
      }


    </section>
  )
}

export default Feed