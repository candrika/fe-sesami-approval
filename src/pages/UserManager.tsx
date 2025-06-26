import {useState, useEffect, useMemo} from 'react';
import { Link } from 'react-router-dom';
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
  type RowSelectionState
} from "@tanstack/react-table"

import instance from '@/lib/axios';

import { Button } from "@/components/ui/button"

import { Checkbox } from "@/components/ui/checkbox"

import {Label} from '@/components/ui/label'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useSelector } from 'react-redux';

import { SelectContent, SelectTrigger,SelectItem, SelectValue, Select } from '@/components/ui/select';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { ChevronDown, MoreHorizontal, Plus , X} from "lucide-react"

export type UserType={
    id:number,
    name:string,
    email:string,
    role:string,
    verified:string
}

const userManager =()=>{
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [users, setUsers] = useState<UserType[]>([])
    const { user } = useSelector((state: RootState) => state.auth);
    const [selectedLeave, setSelectedLeave] = useState<UserType | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
    const [openDialogReset, setOpenDialogReset] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [alert, setAlert] = useState(false)
    const [resposeMessage, setResponseMessage] = useState('')

    const [password, setPassword] = useState('');

    const role = useMemo(()=> user?.role ?? localStorage.getItem('role'),[user])

    const userList = ()=>{

        const url = role == 'Verifikator' ? '/verifikator/users':'/admin/users'
        
        if(!url) return;
        
        instance.get(url)
        .then((resp)=>{
            console.log(resp.data)
            setUsers(resp.data.data)
        }).catch(err=>{
            setUsers(err.response.data.message)
        }) 
    }

    useEffect(()=>{
        userList()
    },[role])

    const columns:ColumnDef<UserType>[]=[
        {
            id:"selected",
            header:({table})=>(
                <Checkbox 
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value)=>table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell:({row})=>(
                <Checkbox 
                    checked={row.getIsSelected()}
                    onCheckedChange={(value)=>row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting:false,
            enableHiding:false
        },
        {
            accessorKey:'name',
            header:'Name',
            cell:({row})=>(
                <div className="capitalize">{row.getValue("name")}</div>
            )
        },
        {
            accessorKey:'email',
            header:'Email',
            cell:({row})=>(
                <div>{row.getValue("email")}</div>
            )
        },
        {
            accessorKey:'role',
            header:'Role',
            cell:({row})=>(
                <div className="capitalize">{row.getValue("role")}</div>
            )
        },
        {
            accessorKey: "verified",
            header: "Verified",
            cell: ({ row }) => <div>{row.getValue("verified") ? "Verified" : "Unverified"}</div>,
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue || filterValue.length === 0) return true;
                const value = row.getValue(columnId) ? "verified" : "unverified";
                return filterValue.includes(value);
            }
        },
        {
            id:"action",
            enableHiding:false,
            cell:({row})=>{
                const leave = row.original
                return(
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                             <Button variant="ghost" className='h-8 w-8 p-0'>
                                <span className='sr-only'>
                                    open menu
                                </span>
                                <MoreHorizontal/>
                             </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {role=='Admin' &&(
                            <DropdownMenuItem
                             onClick={()=>{
                                setSelectedLeave(leave);
                                setOpenDialog(true);
                             }}
                             >
                                Ubah Status
                            </DropdownMenuItem>
                            )}
                            {role=='Admin' &&(
                            <DropdownMenuItem
                             onClick={()=>{
                                setSelectedLeave(leave);
                                setOpenDialogReset(true);
                             }}
                             >
                                Reset Password
                            </DropdownMenuItem>
                             )}
                            {role=='Verifikator' &&(
                            <DropdownMenuItem onClick={()=>{
                                setSelectedLeave(leave);
                                setOpenVerifyDialog(true); // Ini trigger AlertDialog
                             }}>
                                Verifikasi
                            </DropdownMenuItem>
                            )}
                         </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    const table = useReactTable({
        data:users,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        pagination,
        },
    })

    const handleToggleStatus =(status:string)=>{
        const isSelected = selectedStatus.includes(status)
        const updated = isSelected ? selectedStatus.filter((s)=> s !== status):[...selectedStatus,status]
        
        setSelectedStatus(updated)
        console.log(updated, status,table.getColumn("verified"))
        table.getColumn("verified")?.setFilterValue(updated.length > 0 ? updated:undefined)
    }

    return(
        <div className='max-w-screen px-3'>
                {alert && (
                    <div className='py-2'>
                        <Alert variant="default" className='border-green-400 text-green-500'>
                            <X onClick={()=>setAlert(!alert)} className='pointer-cursor'/>
                            
                            <AlertTitle>success</AlertTitle>
                            <AlertDescription className="text-green-400">
                                {resposeMessage}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
                <div className="flex items-center justify-between py-4">
                    <Input 
                        placeholder="Cari" value={(table.getColumn("name")?.getFilterValue() as string)??""}
                        onChange={(event)=>{table.getColumn("name")?.setFilterValue(event.target.value)}} 
                        className='max-w-sm'
                    />
                    <div className="flex flex-row items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto" size="sm">
                                    Status <ChevronDown/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {["verified", "unverified"].map((verified) => (
                                    <DropdownMenuCheckboxItem
                                    key={verified}
                                    checked={selectedStatus.includes(verified)}
                                    onCheckedChange={() => handleToggleStatus(verified)}
                                    >
                                    {verified.charAt(0).toLocaleUpperCase() + verified.slice(1)}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>  
                        </DropdownMenu>
                        <Button variant="outline" size="sm" className='bg-blue-400 flex items-center text-white flex-row justify-center gap-2'>
                            <Plus/> <Link to="/user/form">Tambah User</Link>
                        </Button>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup)=>(
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header)=>{
                                    return(
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null:flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length?(
                                table.getRowModel().rows.map((row)=>(
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                    >
                                        {row.getVisibleCells().map((cell)=>(
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef?.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ):(
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className='h-24 text-center'
                                    >
                                    No Result
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="text-muted-foreground flex-1 text-sm">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label className="text-sm font-medium">Rows per page</Label>
                        <Select
                          value={`${table.getState().pagination.pageSize}`}
                          onValueChange={(value)=>{
                            table.setPageSize(Number(value))
                          }}
                        >
                            <SelectTrigger size="sm" className='w-20' id="rows-per-page">
                                <SelectValue 
                                    placeholder={table.getState().pagination.pageSize}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize)=>(
                                    <SelectItem key={pageSize} value={`${pageSize}`}>{pageSize}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                       Page {table.getState().pagination.pageIndex+1} of {" "} {table.getPageCount()}
                    </div>
                    <div className="space-x-2">
                        <Button 
                            variant='outline' 
                            size="sm" 
                            onClick={()=>table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button 
                            variant='outline' 
                            size="sm" 
                            onClick={()=>table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
                
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <form>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Ubah Status Izin</DialogTitle>
                            <DialogDescription>
                                Kamu akan mengubah status izin: <strong>{selectedLeave?.name}</strong>
                            </DialogDescription>
                            </DialogHeader>
    
                            <Select
                                onValueChange={(value) => {
                                    // Logika update status bisa dilakukan di sini
                                    console.log(`Status izin "${selectedLeave?.id}" diubah jadi "${value}"`);
                                    
                                    const updateStatus = async()=>{
                                        // localhost:3000/api/admin/user/58b9b417-38cd-472f-b432-4d5849c15aa1/role
                                        const resp = await instance.patch(`admin/user/${selectedLeave?.id}/role`,{
                                            role:value
                                        })
                                        console.log(resp.data)
                                        setOpenDialog(false);
                                        userList()
                                        setAlert(true)
                                        setResponseMessage(resp.data.message)
                                    }

                                    updateStatus()
                                }}
                                >
                                <SelectTrigger className="w-full mt-4">
                                    <SelectValue placeholder="Pilih status baru" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="User">User</SelectItem>
                                    <SelectItem value="Verifikator">Verifikator</SelectItem>
                                </SelectContent>
                            </Select>

                        </DialogContent>
                    </form>
                </Dialog>

                <AlertDialog open={openVerifyDialog} onOpenChange={setOpenVerifyDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Yakin ingin meverifikasi user ini?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Ini akan meverifikas user <strong>{selectedLeave?.name}</strong>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    // Simulasi hapus data
                                    console.log("Verikasi ID:", selectedLeave?.id);
                                    const verify=async()=>{
                                        // /api/verifikator/user/d33f560d-8e18-41ed-80f9-65eba42fd9f7/verify
                                        const update = await instance.patch(`verifikator/user/${selectedLeave?.id}/verify`)
                                        console.log(update.data)
                                        setOpenVerifyDialog(false);
                                        userList()
                                        setAlert(true)
                                        setResponseMessage(update.data.message)
                                    }
                                    
                                    verify()

                                }}
                            >
                                Verifikasi
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Dialog open={openDialogReset} onOpenChange={setOpenDialogReset}>
                    <form>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reset Password Pengguna</DialogTitle>
                                <DialogDescription>
                                    Kamu mereset password: <strong>{selectedLeave?.name}</strong>
                                </DialogDescription>
                            </DialogHeader>
                                <div className="grid gap-4">
                                    <Input type="password" name="password" placeholder='********'/>
                                </div>
                            <DialogFooter>
                                <DialogClose>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type='button' onClick={()=>{
                                    const changePassword=async()=>{
                                        const response = await instance.patch(`/admin/user/${selectedLeave?.id}/reset-password`,{
                                            password:password
                                        })
                                        console.log(response, response.data.message)
                                        setOpenDialogReset(false);
                                        setAlert(true)
                                        setResponseMessage(response.data.message)
                                    }   

                                    changePassword()
                                }}>
                                    Reset Password
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
        </div>
    )
}

export default userManager;