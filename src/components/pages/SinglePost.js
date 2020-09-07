import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import { Button, Card, Grid, Form, Image, Icon, Label } from 'semantic-ui-react';

import MyPopup from './../../util/MyPopup'
import { AuthContext } from '../../context/auth';
import LikeButton from '../LikeButton';
import DeleteButton from '../DeleteButton';

function SinglePost(props) {
    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);

    //used to blur comment input after clicking submit button
    const commentInputRef = useRef(null)

    const [comment, setComment] = useState('');



    const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        },
    });

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('')
            commentInputRef.current.blur()

        },
        variables: {
            postId,
            body: comment
        }
    })


    if (loading) return <p>Loading...</p>
    if (error) return <p>Error</p>

    let postMarkup;

    if (!data.getPost) {
        postMarkup = <p>Loading post..</p>;
    } else {
        const {
            id,
            body,
            createdAt,
            username,
            comments,
            likes,
            likeCount,
            commentCount
        } = data.getPost;


        function deletePostCallback() {
            props.history.push('/');
        }

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likeCount, likes }} />

                                <MyPopup content="Commen on Post">
                                    <Button
                                        as="div"
                                        labelPosition="right"
                                        onClick={() => console.log('Comment on post')}>
                                        <Button basic color="blue">
                                            <Icon name="comments" />
                                        </Button>
                                        <Label basic color="blue" pointing="left">
                                            {commentCount}
                                        </Label>
                                    </Button>

                                </MyPopup>

                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a Comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input type="text"
                                                placeholder="Comment.."
                                                name="comment" value={comment}
                                                onChange={e => setComment(e.target.value)}
                                                ref={commentInputRef}>
                                            </input>

                                            <Button type="submit"
                                                className="ui button blue"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment}>
                                                Submit</Button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}

                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>{username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
    return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id body createdAt username
            }
            commentCount
        }
    }

`

export default SinglePost;