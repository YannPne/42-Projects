/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_memset.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <mmacia@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 13:00:17 by mmacia            #+#    #+#             */
/*   Updated: 2023/10/02 14:47:44 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include "libft.h"

void	*ft_memset(void *ptr, int value, size_t count)
{
	char	*ptrchar;

	ptrchar = ptr;
	while (count > 0)
	{
		*ptrchar = value;
		ptrchar++;
		count--;
	}
	return (ptr);
}
