/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   calloc.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 12:32:46 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/02 12:32:52 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	*ft_calloc(size_t num_elements, size_t element_size)
{
	void		*ptr;
	size_t		total;

	total = num_elements * element_size;
	ptr = malloc(total);
	if (ptr == NULL)
		return (NULL);
	while (total--)
		((char *)ptr)[total] = 0;
	return (ptr);
}
