import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, {useCallback, useState, VFC} from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props {
    show : boolean;
    onCloseModal : () => void;
    setShowCreateChannelModal : (flag : boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {

    const [newChannel, setNewChannel] = useState('');
    const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

    const {data: userData, error, revalidate} = useSWR<IUser | false>('/api/users', fetcher, {
        dedupingInterval: 2000
    });

    const {data: channelData, mutate, revalidate: revalidateChannel} = useSWR<IChannel | false>
    (userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);


    const onCreateChannel = useCallback(() => {
        let variables = {
            name: newChannel
        };

        axios
            .post(`api/workspaces/${workspace}/channels`, variables)
            .then((response) => {
                setShowCreateChannelModal(false);
                revalidateChannel();
                setNewChannel('');
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response?.data, {position: 'bottom-center'})
            });
    }, [newChannel]);

    const onChangeNewChannel = useCallback((e) => {
        setNewChannel(e.target.value);
    }, []);


    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id="channel-label">
                    <span>채널</span>
                    <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
                </Label>
                <Button type="submit">생성하기</Button>
            </form>
        </Modal>
    );
};

export default CreateChannelModal;
