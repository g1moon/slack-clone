import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, {FC, useCallback, useState} from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowInviteWorkspaceModal: (flag: boolean) => void;
}
const InviteWorkspaceModal: FC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
    const {workspace, channel} = useParams<{ workspace: string, channel: string; }>();
    const {data: userData, revalidate} = useSWR<IUser | false>('/api/users', fetcher);
    const {revalidate: revalidateMember} = useSWR<IChannel[]>(
        userData ? `/api/workspace/${workspace}/members` : null,
        fetcher,
    );

    const [newMember, setNewMember] = useState('');

    const onInviteMember = useCallback(() => {
        let variable = {
            email: newMember,
        }

        axios
            .post(`api/workspaces/${workspace}/members`, variable)
            .then((response) => {
                revalidateMember();
                setShowInviteWorkspaceModal(false);
                setNewMember('');
            })
            .catch((error) => {
                console.dir(error);
                toast.error(error.response?.data, {position: 'bottom-center'})
            });
    }, [newMember, workspace]);

    const onChangeNewMember = useCallback((e) => {
        setNewMember(e.target.value);
    }, []);


    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onInviteMember}>
                <Label id="member-label">
                    <span>이메일</span>
                    <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
                </Label>
                <Button type="submit">초대하기</Button>
            </form>
        </Modal>
    );
};

export default InviteWorkspaceModal;
