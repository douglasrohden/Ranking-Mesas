import React, { useState, useRef } from 'react';
import { Button, Form, Input, Modal, notification, InputNumber } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import './style.css';

export const AddUserForm = () => {
    const [api, contextHolder] = notification.useNotification();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isClearModalVisible, setIsClearModalVisible] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [disableDescricao, setDisableDescricao] = useState(false);
    const [form] = Form.useForm();
    const comandaRef = useRef(null);
    const descricaoRef = useRef(null);
    const valorRef = useRef(null);

    const openNotification = () => {
        api.open({
            message: 'Salvo com sucesso!',
            description: 'Comanda adicionada!',
            icon: (
                <SmileOutlined
                    style={{
                        color: '#108ee9',
                    }}
                />
            ),
        });
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await window.electronFront.salvarComanda(values);
            openNotification();
            form.resetFields();
            setIsModalVisible(false);
        } catch (errorInfo) {
            console.error('Failed to save:', errorInfo);
        }

        comandaRef.current.focus();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showClearModal = () => {
        setIsClearModalVisible(true);
    };

    const handleClearOk = async () => {
        setClearing(true);
        try {
            await window.electronFront.limparComandas();
            notification.success({
                message: 'Dados apagados',
                description: 'Todas as comandas foram apagadas do banco de dados.',
            });
            setIsClearModalVisible(false);
        } catch (error) {
            console.error('Failed to clear data:', error);
            notification.error({
                message: 'Erro',
                description: 'Ocorreu um erro ao tentar apagar as comandas.',
            });
        } finally {
            setClearing(false);
        }
    };

    const getComanda = async (e) => {

        try {
            let comanda = await window.electronFront.getComanda(e.target.value);
            if (comanda && comanda.dataValues) {
                setDisableDescricao(true);
                form.setFieldsValue({ descricao: comanda.dataValues.descricao.toUpperCase() });
                valorRef.current.focus();
            } else {
                form.setFieldsValue({ descricao: "" });
                setDisableDescricao(false);
                descricaoRef.current.focus();
            }
        } catch (error) {
            console.error('Failed to fetch comanda:', error);
        }
    };


    const handleClearCancel = () => {
        setIsClearModalVisible(false);
    };

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 8,
        },
    };

    const focusDescricao = () => {
        if (!descricaoRef.current) {
            descricaoRef.current.focus();
        } else {
            valorRef.current.focus();
        }
    }

    return (
        <>
            <Form
                form={form}
                className="input-white"
                justify="center"
                align="middle"
                {...layout}
            >
                <Form.Item
                    name="comanda"
                    type="number"
                    className="label-white"
                    label="Nº da Comanda"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira o número da comanda',
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        parser={(value) => value.replace(/\D/g, '')}
                        ref={comandaRef}
                        onPressEnter={getComanda}
                    />
                </Form.Item>
                <Form.Item
                    name="descricao"
                    label="Nome do Camarote"
                    className="label-white"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira um nome do Camarote',
                        },
                    ]}
                >
                    <Input
                        disabled={disableDescricao}
                        onPressEnter={focusDescricao}
                        onChange={(e) => form.setFieldsValue({ descricao: e.target.value.toUpperCase() })}
                        style={{ backgroundColor: '#f0f0f0', color: "#000", fontSize: '15px', fontWeight: 'bold' }}
                        ref={descricaoRef}
                    />
                </Form.Item>
                <Form.Item
                    name="valor"
                    label="Valor"
                    className="label-white"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira o valor',
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        decimalSeparator=","
                        step="0.01"
                        stringMode
                        parser={(value) =>
                            value.replace(/\R\$\s?|(\.)/g, '').replace(',', '.')
                        }
                        onPressEnter={handleOk}
                        ref={valorRef}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
                    {contextHolder}
                    <Button type="primary" onClick={showModal}>
                        Salvar
                    </Button>
                </Form.Item>
            </Form>

            <Modal
                title="Confirmar Salvar"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Salvar"
                cancelText="Voltar"
            >
                <p>Você realmente deseja salvar?</p>
            </Modal>

            <div className="footer-button">
                <Button
                    type="danger"
                    style={{ color: '#FFF' }}
                    onClick={showClearModal}
                >
                    Limpar
                </Button>
            </div>

            <Modal
                title="Confirmar Limpeza"
                open={isClearModalVisible}
                onOk={handleClearOk}
                onCancel={handleClearCancel}
                okText="Limpar"
                cancelText="Cancelar"
            >
                {clearing ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <p>Você realmente deseja limpar todas as comandas?</p>
                )}
            </Modal>
        </>
    );
};

export default AddUserForm;
