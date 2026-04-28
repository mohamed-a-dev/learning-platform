const errorHandler = (error: any) => {
    // during create
    if (error.code === 'P2002')
        return { success: false, message: 'Email already exists', timestamp: Date.now() }

    // during update
    if (error.code === "P2025") 
    return { success: false, message: 'Record not found', timestamp: Date.now() }
    

    // default case
    return { success: false, message: 'Something went wrong', timestamp: Date.now() }
}

export { errorHandler }