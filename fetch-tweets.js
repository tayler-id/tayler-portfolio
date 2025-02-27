// This script fetches tweets from the Twitter API and saves them to a JSON file
// Run this script with Node.js to update the tweets.json file

const fs = require('fs');
const path = require('path');
const https = require('https');

// Twitter API credentials from environment variables
const apiKey = process.env.TWITTER_API_KEY;
const apiSecret = process.env.TWITTER_API_SECRET;
const accessToken = process.env.TWITTER_ACCESS_TOKEN;
const accessSecret = process.env.TWITTER_ACCESS_SECRET;
const bearerToken = process.env.TWITTER_BEARER_TOKEN;

// Function to get bearer token (if not already available)
function getBearerToken() {
  return new Promise((resolve, reject) => {
    // If bearer token is already available, use it
    if (bearerToken) {
      console.log('Using existing bearer token');
      return resolve(bearerToken);
    }

    // Otherwise, get a new bearer token
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    
    const options = {
      hostname: 'api.twitter.com',
      path: '/oauth2/token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('Failed to get bearer token'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write('grant_type=client_credentials');
    req.end();
  });
}

// Function to fetch user tweets
function fetchUserTweets(token, username = 'tayler_ramsay') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.twitter.com',
      path: `/2/users/by/username/${username}?user.fields=id`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.data && response.data.id) {
            const userId = response.data.id;
            fetchTweetsByUserId(token, userId)
              .then(resolve)
              .catch(reject);
          } else {
            reject(new Error('Failed to get user ID'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Function to fetch tweets by user ID
function fetchTweetsByUserId(token, userId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.twitter.com',
      path: `/2/users/${userId}/tweets?tweet.fields=created_at,public_metrics&max_results=10&exclude=retweets,replies`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.data) {
            resolve(response.data);
          } else {
            reject(new Error('Failed to get tweets'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Function to format tweets for our UI
function formatTweets(tweets) {
  return tweets.map(tweet => {
    const date = new Date(tweet.created_at);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    return {
      id: tweet.id,
      content: tweet.text,
      date: formattedDate,
      likes: tweet.public_metrics.like_count,
      retweets: tweet.public_metrics.retweet_count,
      replies: tweet.public_metrics.reply_count
    };
  });
}

// Main function to fetch tweets and save to JSON file
async function main() {
  try {
    console.log('Fetching tweets...');
    
    // Get bearer token
    const token = await getBearerToken();
    console.log('Bearer token acquired');
    
    // Fetch tweets
    const tweets = await fetchUserTweets(token);
    console.log(`Fetched ${tweets.length} tweets`);
    
    // Format tweets for our UI
    const formattedTweets = formatTweets(tweets);
    
    // Save tweets to JSON file
    const outputPath = path.join(__dirname, 'tweets.json');
    fs.writeFileSync(outputPath, JSON.stringify(formattedTweets, null, 2));
    console.log(`Tweets saved to ${outputPath}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main();
