import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Grid, Transition } from 'semantic-ui-react'
import { AuthContext } from './../../context/auth'

import PostCard from './../PostCard'
import PostForm from './../PostForm'
import { FETCH_POSTS_QUERY } from './../../util/graphql'

function Home() {
    const { user } = useContext(AuthContext)

    //lading is true whenever data is loading
    //getPosts is the object in data containing all our posts. and we alias that as posts
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);

    if (loading) return <div>Loading...</div>;
    //TODO: Fix not found data later
    if (!data) return <p>Not found</p>


    const posts = data.getPosts;
    //  console.log(posts);

    return (
        <Grid columns={3}>
            <Grid.Row className="pageTitle">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm></PostForm>
                    </Grid.Column>
                )}
                {loading ? (
                    <h1>Loading...</h1>
                ) : (
                        <Transition.Group>
                            {posts &&
                                posts.map((post) => (
                                    <Grid.Column key={post.id}>
                                        <PostCard post={post} />
                                    </Grid.Column>

                                ))
                            }

                        </Transition.Group>
                    )}

            </Grid.Row>
        </Grid>
    );
}




export default Home;