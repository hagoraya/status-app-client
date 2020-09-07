import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { Button, Confirm, Icon } from 'semantic-ui-react'
import { FETCH_POSTS_QUERY } from './../util/graphql'
import MyPopup from '../util/MyPopup'

function DeleteButton({ postId, commentId, callback }) {

    const [confirmOpen, setConfirmOpen] = useState(false)


    //if commentId then we are deleting a comment and not a post
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);

            if (!commentId) {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });

                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: data.getPosts.filter(p => p.id !== postId)
                    }
                })
            }

            if (callback) callback();
        },
        variables: {
            postId, commentId
        }
    });


    return (
        <>
            <MyPopup content={commentId ? 'Delete Comment' : 'Delete Post'}>
                <Button as="div"
                    color='red'
                    onClick={() => setConfirmOpen(true)}
                    floated="right"
                >
                    <Icon name='trash' style={{ margin: 0 }}></Icon>
                </Button>
            </MyPopup>

            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrMutation}>
            </Confirm>
        </>
    )

}

const DELETE_POST_MUTATION = gql`
    mutation deletePostOrMutation($postId: ID!){
        deletePostOrMutation(postId: $postId)
    }


`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`

export default DeleteButton
