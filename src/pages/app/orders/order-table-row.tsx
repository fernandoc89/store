import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { OrderStatus } from "@/components/ui/order-status";
import { TableCell, TableRow } from "@/components/ui/table";
import { ArrowRight, Search, X } from "lucide-react";
import { OrderDetails } from "./order-details";

import { approveOrder } from "@/api/approve-order";
import { cancelOrder } from "@/api/cancel-order";
import { deliverOrder } from "@/api/deliver-order";
import { dispatchOrder } from "@/api/dispatch-order";
import { GetOrdersResponse } from "@/api/get-orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from "react";

export interface OrderTableRowProps {
    order: {
        orderId: string;
        createdAt: Date;
        status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
        customerName: string;
        total: number;
    }
}

export function OrderTableRow({ order }: OrderTableRowProps) {

    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const queryClient = useQueryClient()

    function updateOrderStatusOnCache(orderId: string, status: OrderStatus) {
        const ordersListCache = queryClient.getQueriesData<GetOrdersResponse>({
            queryKey: ['orders']
        })

        ordersListCache.forEach(([cacheKey, cacheData]) => {
            if (!cacheData) {
                return
            }

            queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
                ...cacheData,
                orders: cacheData.orders.map(order => {
                    if (order.orderId === orderId) {
                        return {
                            ...order,
                            status
                        }
                    }

                    return order
                })
            })
        })
    }

    const { mutateAsync: cancelOrderFn, isPending: isCancelingOrder } = useMutation({
        mutationFn: cancelOrder,
        async onSuccess(_, { orderId }) {
            updateOrderStatusOnCache(orderId, 'canceled')

        },
    })

    const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } = useMutation({
        mutationFn: approveOrder,
        async onSuccess(_, { orderId }) {
            updateOrderStatusOnCache(orderId, 'processing')

        },
    })

    const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } = useMutation({
        mutationFn: dispatchOrder,
        async onSuccess(_, { orderId }) {
            updateOrderStatusOnCache(orderId, 'delivering')

        },
    })

    const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } = useMutation({
        mutationFn: deliverOrder,
        async onSuccess(_, { orderId }) {
            updateOrderStatusOnCache(orderId, 'delivered')

        },
    })

    return (
        <TableRow>
            <TableCell>
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="xs">
                            <Search className="h-3 w-3" />
                            <span className="sr-only">Detalhes do pedido</span>
                        </Button>
                    </DialogTrigger>
                    <OrderDetails open={isDetailsOpen} orderId={order.orderId} />
                </Dialog>

            </TableCell>
            <TableCell className="font-mono text-xs font-medium">{order.orderId}</TableCell>
            <TableCell className="text-muted-foreground">
                {formatDistanceToNow(order.createdAt, {
                    locale: ptBR,
                    addSuffix: true
                })}
            </TableCell>
            <TableCell className="">
                <OrderStatus status={order.status} />
            </TableCell>
            <TableCell className="font-medium">{order.customerName}</TableCell>
            <TableCell className="font-medium">
                {(order.total / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}
            </TableCell>
            <TableCell className="">
                {order.status === 'pending' && (
                    <Button
                        onClick={() => approveOrderFn({ orderId: order.orderId })}
                        disabled={isApprovingOrder}
                        variant="outline"
                        size="xs"
                    >
                        <ArrowRight className="h-3 w-3 mr-2" />
                        Aprovar
                    </Button>
                )}

                {order.status === 'processing' && (
                    <Button
                        onClick={() => dispatchOrderFn({ orderId: order.orderId })}
                        disabled={isDispatchingOrder}
                        variant="outline"
                        size="xs"
                    >
                        <ArrowRight className="h-3 w-3 mr-2" />
                        Em entrega
                    </Button>
                )}

                {order.status === 'delivering' && (
                    <Button
                        onClick={() => deliverOrderFn({ orderId: order.orderId })}
                        disabled={isDeliveringOrder}
                        variant="outline"
                        size="xs"
                    >
                        <ArrowRight className="h-3 w-3 mr-2" />
                        Entregue
                    </Button>
                )}
            </TableCell>
            <TableCell className="">
                <Button
                    disabled={
                        !['pending', 'processing'].includes(order.status) ||
                        isCancelingOrder
                    }
                    onClick={() => cancelOrderFn({ orderId: order.orderId })}
                    variant="ghost"
                    size="xs"
                >
                    <X className="h-3 w-3 mr-2" />
                    Cancelar
                </Button>
            </TableCell>
        </TableRow>
    )
}
