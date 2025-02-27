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
      
      // Format links in tweet content
      let formattedContent = tweet.content;
      
      // Format hashtags
      formattedContent = formattedContent.replace(/#(\w+)/g, '<a href="https://twitter.com/hashtag/$1" target="_blank">#$1</a>');
      
      // Format URLs
      formattedContent = formattedContent.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
      
      // Format mentions
      formattedContent = formattedContent.replace(/@(\w+)/g, '<a href="https://twitter.com/$1" target="_blank">@$1</a>');
      
      tweetElement.innerHTML = `
        <div class="tweet-content">${formattedContent}</div>
        <div class="tweet-date">${tweet.date}</div>
        <div class="tweet-actions">
          <div class="tweet-action">
            <i class="far fa-heart"></i>
            <span>${tweet.likes || 0}</span>
          </div>
          <div class="tweet-action">
            <i class="fas fa-retweet"></i>
            <span>${tweet.retweets || 0}</span>
          </div>
          <div class="tweet-action">
            <i class="far fa-comment"></i>
            <span>${tweet.replies || 0}</span>
          </div>
        </div>
      `;
      
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
