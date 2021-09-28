# titaniumaplus

## URL Shortner Project Requirement

## Phase I

### Key points
- Create a group database `groupXDatabase`. You can clean the db you previously used and resue that.
- This time each group should have a *single git branch*. Coordinate amongst yourselves by ensuring every next person pulls the code last pushed by a team mate. You branch will be checked as part of the demo. Branch name should follow the naming convention `project/urlShortnerGroupX`
- Follow the naming conventions exactly as instructed. The backend code will be integrated with the front-end application which means any mismatch in the expected request body will lead to failure in successful integration.

### Models
- Url Model
```
{ urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }
```

### POST /url/shorten
- Create a short URL for an original url recieved in the request.
- Return the shortened unique url. Refer [this](#url-shorten-response) for the response
- Ensure the same response is returned for an original url everytime
- Return HTTP status 400 for an invalid request

### GET /:code
- Redirect to long/original URL
- Use a valid HTTP status code meant for a redirection scenario.
- Return a suitable error for a url not found
- Return HTTP status 400 for an invalid request

## Testing 
- To test these apis create a new collection in Postman named Project 4 Url Shortner
- Each api should have a new request in this collection
- Each request in the collection should be rightly named. Eg  Url shorten, Get Url etc
- Each member of each team should have their tests in running state


## Response

### Successful Response structure
```yaml
{
  status: true,
  data: {

  }
}
```
### Error Response structure
```yaml
{
  status: false,
  msg: ""
}
```
## Response samples

### Url shorten response
```yaml
{
  "data": {
    "longUrl": "https://www.oneofthelongesturlseverseenbyhumans.com",
    "shortUrl": "https://bit.ly/2WlQej2a",
    "urlCode": "xyz"
  }
}

```
