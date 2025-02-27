/**
 * Twitter Feed Integration
 * 
 * This script loads and displays Twitter posts from Tayler Ramsay.
 * It uses tweets fetched from the Twitter API and saved to a JSON file.
 * 
 * To update the tweets, run the fetch-tweets.js script with Node.js:
 * node fetch-tweets.js
 */

document.addEventListener('DOMContentLoaded', function() {
  // Default tweets to use if the JSON file is not available
  const defaultTweets = [
    {
      id: '1',
      content: 'Just published a new article on creating accessible design systems that scale across multiple platforms. #UX #DesignSystems #Accessibility',
      date: 'Feb 24, 2025',
      likes: 142,
      retweets: 38,
      replies: 12
    },
    {
      id: '2',
      content: 'The key to effective UX isn\'t just making things pretty—it\'s about making them work intuitively. Users shouldn\'t have to think about how to use your interface. #UXDesign #UserExperience',
      date: 'Feb 20, 2025',
      likes: 215,
      retweets: 76,
      replies: 23
    },
    {
      id: '3',
      content: 'Excited to share that our team just launched a completely redesigned financing application flow, reducing abandonment by 32% and increasing conversion by 18%. The power of thoughtful UX! #FinTech #UXSuccess',
      date: 'Feb 15, 2025',
      likes: 189,
      retweets: 45,
      replies: 17
    },
    {
      id: '4',
      content: 'Hot take: Internal tools deserve the same UX attention as customer-facing products. Your team\'s productivity depends on it. #InternalTools #DesignSystems #UX',
      date: 'Feb 10, 2025',
      likes: 267,
      retweets: 93,
      replies: 31
    }
  ];
  
  // Function to fetch tweets from the JSON file
  function fetchTweets() {
    return fetch('./tweets.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load tweets');
        }
        return response.json();
      })
      .catch(error => {
        console.warn('Error loading tweets:', error);
        console.log('Using default tweets instead');
        return defaultTweets;
      });
  }

  // Function to render tweets
  function renderTweets(tweets) {
    const tweetsContainer = document.getElementById('tweets-container');
    
    // Clear loading spinner
    tweetsContainer.innerHTML = '';
    
    // Add tweets to container
    tweets.forEach(tweet => {
      const tweetElement = document.createElement('div');
      tweetElement.className = 'tweet';
      
      // Create content element
      const contentElement = document.createElement('div');
      contentElement.className = 'tweet-content';
      
      // Process the tweet content to create proper links
      let content = tweet.content;
      
      // Create a document fragment to hold the processed content
      const fragment = document.createDocumentFragment();
      
      // Split the content by spaces to process each word
      const words = content.split(' ');
      
      words.forEach((word, index) => {
        // Check if the word is a hashtag
        if (word.startsWith('#')) {
          const tag = word.substring(1);
          const link = document.createElement('a');
          link.href = `https://twitter.com/hashtag/${tag}`;
          link.target = '_blank';
          link.textContent = word;
          fragment.appendChild(link);
        }
        // Check if the word is a URL
        else if (word.match(/^https?:\/\//i)) {
          const link = document.createElement('a');
          link.href = word;
          link.target = '_blank';
          link.textContent = word;
          fragment.appendChild(link);
        }
        // Check if the word is a mention
        else if (word.startsWith('@')) {
          const username = word.substring(1);
          const link = document.createElement('a');
          link.href = `https://twitter.com/${username}`;
          link.target = '_blank';
          link.textContent = word;
          fragment.appendChild(link);
        }
        // Regular word
        else {
          fragment.appendChild(document.createTextNode(word));
        }
        
        // Add a space after each word except the last one
        if (index < words.length - 1) {
          fragment.appendChild(document.createTextNode(' '));
        }
      });
      
      // Add the processed content to the content element
      contentElement.appendChild(fragment);
      
      // Create date element
      const dateElement = document.createElement('div');
      dateElement.className = 'tweet-date';
      dateElement.textContent = tweet.date;
      
      // Create actions element
      const actionsElement = document.createElement('div');
      actionsElement.className = 'tweet-actions';
      
      // Create like action
      const likeAction = document.createElement('div');
      likeAction.className = 'tweet-action';
      const likeIcon = document.createElement('i');
      likeIcon.className = 'far fa-heart';
      const likeCount = document.createElement('span');
      likeCount.textContent = tweet.likes || 0;
      likeAction.appendChild(likeIcon);
      likeAction.appendChild(document.createTextNode(' '));
      likeAction.appendChild(likeCount);
      
      // Create retweet action
      const retweetAction = document.createElement('div');
      retweetAction.className = 'tweet-action';
      const retweetIcon = document.createElement('i');
      retweetIcon.className = 'fas fa-retweet';
      const retweetCount = document.createElement('span');
      retweetCount.textContent = tweet.retweets || 0;
      retweetAction.appendChild(retweetIcon);
      retweetAction.appendChild(document.createTextNode(' '));
      retweetAction.appendChild(retweetCount);
      
      // Create reply action
      const replyAction = document.createElement('div');
      replyAction.className = 'tweet-action';
      const replyIcon = document.createElement('i');
      replyIcon.className = 'far fa-comment';
      const replyCount = document.createElement('span');
      replyCount.textContent = tweet.replies || 0;
      replyAction.appendChild(replyIcon);
      replyAction.appendChild(document.createTextNode(' '));
      replyAction.appendChild(replyCount);
      
      // Add actions to actions element
      actionsElement.appendChild(likeAction);
      actionsElement.appendChild(retweetAction);
      actionsElement.appendChild(replyAction);
      
      // Add all elements to the tweet element
      tweetElement.appendChild(contentElement);
      tweetElement.appendChild(dateElement);
      tweetElement.appendChild(actionsElement);
      
      // Add the tweet element to the container
      tweetsContainer.appendChild(tweetElement);
    });
  }

  // Load and render tweets
  fetchTweets()
    .then(tweets => {
      // Simulate loading delay for better UX
      setTimeout(() => {
        renderTweets(tweets);
      }, 1000);
    });
});
