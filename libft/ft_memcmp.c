/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   memcmp.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 12:24:08 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/02 12:24:16 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

int	ft_memcmp(const void *ptr1, const void *ptr2, size_t num)
{
	char	*c_ptr1;
	char	*c_ptr2;
	int		i;

	i = 0;
	c_ptr1 = (char *)ptr1;
	c_ptr2 = (char *)ptr2;
	if (!num)
		return (0);
	while (c_ptr1[i] == c_ptr2[i] && --num)
		i++;
	return ((unsigned char)c_ptr1[i] - (unsigned char)c_ptr2[i]);
}

/*
int main(void) {
    char str1[] = "Hello";
    char str2[] = "Hello";
    char str3[] = "World";

    int result1 = ft_memcmp(str1, str2, strlen(str1));
    int result2 = ft_memcmp(str1, str3, strlen(str1));

    if (result1 == 1) {
        printf("str1 et str2 sont égaux.\n");
    } else {
        printf("str1 et str2 ne sont pas égaux.\n");
    }

    if (result2 == -1) {
        printf("str1 et str3 sont égaux.\n");
    } else {
        printf("str1 et str3 ne sont pas égaux.\n");
    }

    return 0;
}
*/
