import React, { useContext } from 'react'
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { AuthContext } from './../context/auth'

import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import MyPopup from './../util/MyPopup'

import gql from 'graphql-tag'

function PostCard(props) {
    const { body, createdAt, id, username, likeCount, commentCount, likes } = props.post

    const { user } = useContext(AuthContext)



    function commentOnPost() {
        console.log("comment on post")
    }

    return (
        <Card fluid>
            <Card.Content as={Link} to={`/posts/${id}`}>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta >{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>


                <LikeButton user={user} post={{ id, likes, likeCount }} />

                <MyPopup
                    content="Comment on post">

                    <Button as='div' labelPosition='right' as={Link} to={`/posts/${id}`}>
                        <Button color='blue' basic>
                            <Icon name='comments' />

                        </Button>
                        <Label as='a' basic color='blue' pointing='left'>
                            {commentCount}
                        </Label>
                    </Button>

                </MyPopup>



                {user && user.username === username && <DeleteButton postId={id} />}


            </Card.Content>
        </Card>
    )
}




export default PostCard