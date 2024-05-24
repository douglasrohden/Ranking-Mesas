export const useValidedInitialData = async () => {

    const data = await window.electronFront.getComandas();
    let dataExist = false;
    if (data != null) {
        dataExist = true;
    }

    return dataExist;

}