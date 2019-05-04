// @flow

import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

type Props = {
  onSubmit: () => void
}

export default function NewReply({onSubmit}: Props) {
  const [reply, setReply] = useState('');

  const submitForm = (e) => {
    e.preventDefault();
    onSubmit(reply);
  }

  return (
    <form className='new-reply' onSubmit={submitForm}>
      <TextField
        name="reply" label="Your reply" multiline margin='dense' value={reply}
        onChange={event => setReply(event.target.value)}
        inputRef={inp => inp && setTimeout(() => inp.focus(), 100)}
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary" size="small">
        Reply
      </Button>
    </form>
  )
}
