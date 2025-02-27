/**
 * Twitter Feed Integration
 * 
 * This script fetches and displays the most viewed Twitter posts from Tayler Ramsay.
 * It uses a mock data approach since direct Twitter API integration would require
 * authentication tokens that are not available in this static site context.
 */

document.addEventListener('DOMContentLoaded', function() {
  // In a real implementation, this would be replaced with an actual API call
  // to Twitter's API using proper authentication
  const mockTweets = [
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

  // Function to render tweets
  function renderTweets(tweets) {
    const tweetsContainer = document.getElementById('tweets-container');
    
    // Clear loading spinner
    tweetsContainer.innerHTML = '';
    
    // Add tweets to container
    tweets.forEach(tweet => {
      const tweetElement = document.createElement('div');
      tweetElement.className = 'tweet';
      
      // Format links in tweet content (this is a simple version)
      const formattedContent = tweet.content.replace(/#(\w+)/g, '<a href="https://twitter.com/hashtag/$1" target="_blank">#$1</a>');
      
      tweetElement.innerHTML = `
        <div class="tweet-content">${formattedContent}</div>
        <div class="tweet-date">${tweet.date}</div>
        <div class="tweet-actions">
          <div class="tweet-action">
            <i class="far fa-heart"></i>
            <span>${tweet.likes}</span>
          </div>
          <div class="tweet-action">
            <i class="fas fa-retweet"></i>
            <span>${tweet.retweets}</span>
          </div>
          <div class="tweet-action">
            <i class="far fa-comment"></i>
            <span>${tweet.replies}</span>
          </div>
        </div>
      `;
      
      tweetsContainer.appendChild(tweetElement);
    });
  }

  // Simulate loading delay for realism
  setTimeout(() => {
    renderTweets(mockTweets);
  }, 1500);
});
