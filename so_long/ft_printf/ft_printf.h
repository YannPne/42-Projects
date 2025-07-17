/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_printf.h                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/09 12:09:03 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/09 12:09:05 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FT_PRINTF_H
# define FT_PRINTF_H

# include <stdarg.h>
# include <unistd.h>
# include <stdlib.h>
# include <stdio.h>

void	ft_putnbr(unsigned int n, int *i);

int		ft_printf(const char *str, ...);
int		ft_printchar(char c);
int		ft_printstr(char *str);
int		ft_printnumber(int nb);
int		ft_printunsigned(unsigned int nb);
int		ft_printpointeur(unsigned long long address);
int		ft_printhexa(unsigned int nb, int maj);
int		ft_type(va_list args, char c);
int		ft_printneghexa(int nb, int maj, char *base, int i);

#endif
