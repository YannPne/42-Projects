/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line.h                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/20 19:05:30 by mmacia            #+#    #+#             */
/*   Updated: 2023/10/20 19:05:45 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef GET_NEXT_LINE_H
# define GET_NEXT_LINE_H

# ifndef BUFFER_SIZE
#  define BUFFER_SIZE 1
# endif

# include <unistd.h>
# include <stdlib.h>
# include <fcntl.h>
# include <stdio.h>

char			*get_next_line(int fd);
int				ft_strlen_gnl(const char *str);
char			*ft_substr_gnl(char const *s, unsigned int start, size_t len);
char			*ft_strchr_gnl(const char *s, int i);
char			*ft_strdup_gnl(const char *s);
char			*ft_strjoin_gnl(char *s1, char *s2);
char			*ft_strcpy(char *dest, char *src);

#endif
