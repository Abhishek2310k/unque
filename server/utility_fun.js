const respone_setter = (res,status_code,error,data) => {
    return res.status(status_code).json({data:data,error:error});
}

export default respone_setter;