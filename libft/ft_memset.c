/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   memset.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 12:46:28 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/02 12:49:05 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	*ft_memset(void *ptr, int value, size_t num)
{
	char		*convert_ptr;
	size_t		i;

	convert_ptr = ptr;
	i = 0;
	while (num > i)
	{
		convert_ptr[i] = value;
		i++;
	}
	return (ptr);
}

/*
int main(void)
{
    char str[] = "Hello, World!";
    size_t len = 5; // Remplir les 5 premiers caractères

    printf("Avant memset : %s\n", str);

    ft_memset(str, 'A', len);

    printf("Après memset : %s\n", str);

    return 0;
}
*/
