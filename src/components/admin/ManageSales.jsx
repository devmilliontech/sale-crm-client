import React from 'react'
import AdminLayout from '../../layout/AdminLayout'
import MainTemplate from '../template/MainTemplate'
import { Box, Button, Dialog, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import ButtonComponent from '../common/ButtonComponet'
import AddExecutive from '../../dialog/AddExecutive'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Delete } from '@mui/icons-material'
import toast from 'react-hot-toast'

const ManageSales = () => {
  const [open, setOpen] = useState(false)
  const [users, setUser] = useState(null)
  const { loginData } = useSelector(state => state.auth)
  const { token } = loginData
  const [loading, setLoading] = useState(false)

  let toastID

  const handleOpen = () => {
    setOpen(!open)
  }

  const fetchAllUsers = async () => {
    setLoading(true)
    toastID = toast.loading("Loading...")
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(data)
    } catch (error) {
      if (error?.response?.data?.message) {
        if (error?.response?.data?.message == "jwt expired") {
          navigate("/login")
        }
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed To Fetch Sales Executive")
      }
    }
    setLoading(false)
    toast.dismiss(toastID)
  }

  const handleDelete = async (id) => {

    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      fetchAllUsers()
      toast.success("User Deleted Successfully")
    } catch (error) {
      console.log(error)
      toast.error("Failed To Delete")
    }

  }


  useEffect(() => {
    fetchAllUsers()

    return () => {
      setLoading(false)
      toast.dismiss(toastID)
    }
  }, [open])

  return (
    <AdminLayout>
      <Dialog open={loading}></Dialog>
      <MainTemplate>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography variant='h5' fontWeight={"bold"}>Manage Sales Executive</Typography>
          <ButtonComponent text={"Add Sales Executive"} action={handleOpen} />
        </Box>

        <TableContainer component={Box} bgcolor={"white"} sx={{ mt: 6, borderRadius: 4 }}>
          {
            users == false ? <Typography m={4} textAlign={"center"} variant='h6'>Sales Member Not Found</Typography> : <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell >ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Clients</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row._id}
                    </TableCell>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.clients}</TableCell>
                    

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
        </TableContainer>

        <AddExecutive open={open} handleOpen={handleOpen} />

      </MainTemplate>
    </AdminLayout>
  )
}

export default ManageSales