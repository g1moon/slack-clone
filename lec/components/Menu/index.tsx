import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface Props {
    show: boolean;
    onCloseModal: (e: any) => void; //menu닫아주기
    style: CSSProperties;
    closeButton?: boolean;
}
const Menu: FC<Props> = ({ children, style,
                             show, onCloseModal, closeButton }) => {

    const stopPropagation = useCallback((e) => {
        e.stopPropagation();
    }, []);

    if (!show) return null;

    return (
        <CreateMenu onClick={onCloseModal}>
            <div style={style} onClick={stopPropagation}>
                {/*closeButton이 rue일떄만 버튼 보여주고 -> 버튼 누르면 닫아주고*/}
                {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
                {children}
            </div>
        </CreateMenu>
    );
};
Menu.defaultProps = {
    closeButton: true,
};

export default Menu;
