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

import { ChevronDown, MoreHorizontal, Plus , X} from "lucide-react"

import { Button } from "@/components/ui/button"

import { Checkbox } from "@/components/ui/checkbox"

import {Label} from '@/components/ui/label'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
 } from "@/components/ui/dialog"

import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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

import { type RootState } from '../app/store';

import { SelectContent, SelectTrigger,SelectItem, SelectValue, Select } from '@/components/ui/select';

import instance from '@/lib/axios';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export type Leave = {
    id:string,
    title:string,
    description:string,
    status:string
}

const LeaveList =()=>{

    const [leaves, setLeaves] = useState<Leave[]>([])
    const { user } = useSelector((state: RootState) => state.auth);
    const [message, setMessage] = useState('')
    const [alert, setAlert] = useState(false)
    const [resposeMessage, setResponseMessage] = useState('')
    const role = useMemo(()=> user?.role ?? localStorage.getItem('role'),[user])

    const list = ()=>{
        const url = role =='User' ? '/leaves': role =='Verifikator' ? 'verifikator/leaves':''
        
        if(!url) return;
        
        instance.get(url)
        .then((resp)=>{
            console.log(resp.data)
            setLeaves(resp.data.data)
        }).catch(err=>{
            setMessage(err.response.data.message)
        })           
    }

    useEffect(()=>{
        list()
    },[role])

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

    const columns:ColumnDef<Leave>[]=[
    {
        id:"select",
        header:({table})=>(
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value)=>table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),  
        cell:({row})=>(
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting:true,
        enableHiding:false
    },
    {
        accessorKey:"title",
        header:'Title',
        cell:({row})=>(
            <div className="capitalize">{row.getValue("title")}</div>
        )
    },
    {
        accessorKey:"description",
        header:'Description',
        cell:({row})=>(
            <div className="capitalize">{row.getValue("description")}</div>
        )
    },
    {
        accessorKey:"status",
        header:'Status',
        cell:({row})=>(
            <div className="capitalize">{row.getValue("status")}</div>
        ),
        enableColumnFilter: true,
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
                         <DropdownMenuItem
                         onClick={()=>{
                            setSelectedLeave(leave);
                            setOpenDialog(true);
                         }}
                         >
                            Ubah Status
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={`/izin/edit/${leave.id}`}>
                                Edit
                            </Link>
                         </DropdownMenuItem>
                         <DropdownMenuItem
                         onClick={()=>{
                            setSelectedLeave(leave);
                            setOpenDeleteDialog(true); // Ini trigger AlertDialog
                         }}
                         >
                            Hapus
                         </DropdownMenuItem>
                     </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
    ];

    const table = useReactTable({
        data:leaves,
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

        table.getColumn("status")?.setFilterValue(updated.length > 0 ? updated:undefined)
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
                    placeholder="Cari" value={(table.getColumn("title")?.getFilterValue() as string)??""}
                    onChange={(event)=>{table.getColumn("title")?.setFilterValue(event.target.value)}} 
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
                            {["terima","revisi","tolak","batal"].map((status)=>(
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={selectedStatus.includes(status)}
                                    onCheckedChange={()=>handleToggleStatus(status)}
                                >
                                    {status.charAt(0).toLocaleUpperCase()+status.slice(1)}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" className='bg-blue-400 flex items-center text-white flex-row justify-center gap-2'>
                        <Plus/> <Link to="/izin/tambah">Buat Izin</Link>
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
                                {message}
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
                            Kamu akan mengubah status izin: <strong>{selectedLeave?.title}</strong>
                        </DialogDescription>
                        </DialogHeader>

                        <Select
                        onValueChange={(value) => {
                            // Logika update status bisa dilakukan di sini
                            console.log(`Status izin "${selectedLeave?.id}" diubah jadi "${value}"`);
                            const updateStatus = async()=>{
                                const url = role =='User' ? `/leave/${selectedLeave?.id}`:`verifikator/leaves/${selectedLeave?.id}`
                                const update = await instance.patch(`${url}/update-status`,{
                                    status:value
                                })

                                console.log(update.data.message)
                                setResponseMessage(update.data.message)
                                setAlert(true)
                                setOpenDialog(false);
                                list()
                            }

                            updateStatus()
                        }}
                        >
                        <SelectTrigger className="w-full mt-4">
                            <SelectValue placeholder="Pilih status baru" />
                        </SelectTrigger>
                        <SelectContent>
                            {role =='Verifikator' &&(
                                <SelectItem value="Terima">ACC</SelectItem>
                            )}
                            {role =='Verifikator' &&(
                                <SelectItem value="Tolak">Tolak</SelectItem>
                            )}
                            {role =='User' &&(
                                <SelectItem value="Batal">Batal</SelectItem>
                            )}
                        </SelectContent>
                        </Select>
                    </DialogContent>
                </form>
            </Dialog>
            <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Yakin ingin menghapus izin ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ini akan menghapus data izin <strong>{selectedLeave?.title}</strong> secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                const handleDelete = async () => {
                                    if (!selectedLeave) return
                                    
                                    try {
                                        const hapus = await instance.delete(`/leave/${selectedLeave.id}`)
                                    
                                        setOpenDeleteDialog(false)
                                        setResponseMessage(hapus.data.message)
                                        setAlert(true)
                                        setSelectedLeave(null)
                                        list()

                                    } catch (err: any) {
                                        toast.error(err?.response?.data?.message || 'Gagal menghapus data')
                                    }
                                }

                                handleDelete()
                            }}
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
} 

export default LeaveList;