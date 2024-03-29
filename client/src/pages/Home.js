import React from 'react'
import {useQuery} from '@apollo/client'
import gql from 'graphql-tag'
import {Grid} from 'semantic-ui-react'
import PostCard from '../components/PostCard'

const Home = () => {
  const {loading, data, data: {getPosts}} = useQuery(FETCH_POSTS_QUERY)

  if (data) {
    console.log(data)
  }

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title"><h1>Recent Posts</h1></Grid.Row>
      <Grid.Row>
        {loading ? 
          <h1>Loading posts...</h1>
        : getPosts && getPosts.map(post => (
          <Grid.Column key={post.id} style={{marginBottom: "20px"}}>
            <PostCard post={post} />
          </Grid.Column>
        ))}
      </Grid.Row>
    </Grid>
  )
}

const FETCH_POSTS_QUERY = gql`
  {
    getPosts{
      id body createdAt username likeCount
      likes {
        username
      }
      commentCount,
      comments {
        id body username createdAt
      }
    }
  }

`

export default Home